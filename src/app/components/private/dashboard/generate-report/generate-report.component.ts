import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { RequestList } from 'src/models/request.interface';
import { ResponseList } from 'src/models/response-list.model';
import { RequestListsService } from 'src/services/request-list/request-lists.service';
import { CryptsService } from 'src/services/utils/crypts.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';
import { PayloadPDF, WebsocketResponse } from 'src/models/websocket-response.model';
import { DownloadPdfInformService } from 'src/app/services/download-pdf-inform/download-pdf-inform.service';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TypeOfPerson } from 'src/enum/type-of-person.enum';
import { ClientService } from 'src/app/services/apis/client/client.service';
import { Package } from 'src/models/package.model';
import { Plan } from 'src/models/plan.model';
import { zip } from 'rxjs';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
})
export class GenerateReportComponent implements OnInit {
  TypeOfPerson = TypeOfPerson;

  selectedPersonType?: TypeOfPerson;
  packages: Package[] = [];
  packagesFiltered: Package[] = [];
  selectedPackages: { packageId: number; selected: boolean }[] = [];

  selectedPlan?: Plan;

  personTypes = [
    { text: 'naturalPerson', value: TypeOfPerson.NATURAL },
    { text: 'legalPerson', value: TypeOfPerson.LEGAL },
  ];

  countries = [
    {
      country_name: 'Brasil',
      country_id: 'BR',
    },
  ];

  identityTypes = [
    {
      countryId: 1,
      code: 'CNPJ',
      name: 'CNPJ',
      enabled: true,
      mask: '00.000.000/0000-00',
    },
    {
      id: 2,
      countryId: 2,
      code: 'CC',
      name: 'Cédula de ciudadania',
      enabled: true,
      pattern: '^\\d{8}(\\d{2})?$',
    },
    {
      id: 3,
      countryId: 2,
      code: 'NIT',
      name: 'NIT',
      enabled: true,
      mask: '000.000.000-0',
    },
    {
      id: 4,
      countryId: 3,
      code: 'RUC',
      name: 'RUC',
      enabled: true,
      mask: '0000000000000',
    },
    {
      id: 5,
      countryId: 4,
      code: 'RUC',
      name: 'RUC',
      enabled: true,
      mask: '00000000000',
    },
    {
      id: 6,
      countryId: 5,
      code: 'CUIT',
      name: 'CUIT',
      enabled: true,
      mask: '00000000000',
    },
    {
      id: 7,
      countryId: 6,
      code: 'RUT',
      name: 'RUT',
      enabled: true,
      mask: '00000000A',
    },
  ];

  identityTypesFiltered: any = [];
  identityTypesAvailable: any = [];

  countriesFiltered: any = [];

  formRequest: FormGroup = new FormGroup({
    country: new FormControl(null, [Validators.required]),
    id_type: new FormControl(null, [Validators.required]),
    id_number: new FormControl(null, [Validators.required]),
    name: new FormControl(null, []),
    holder_authorization: new FormControl(true, [Validators.requiredTrue]),
  });

  succeedList: any = [];
  failedList: any = [];
  connectionId?: string;
  showResult: boolean = false;
  payloadToGetPdfInform?: WebsocketResponse;
  enableGetPdfInformConfirm: boolean = false;
  average: number = 50;
  urlPdf: string = '';
  payloadPdf?: PayloadPDF;
  isVisible: BooleanInput;
  isOkLoading: BooleanInput;
  pdfRenderUrl?: SafeResourceUrl;

  constructor(
    private readonly requestListsService: RequestListsService,
    private readonly notification: NzNotificationService,
    private readonly spinner: NgxSpinnerService,
    private readonly cryptsService: CryptsService,
    private readonly transportDataWsService: TransportDataWsService,
    private readonly downloadPdfInformService: DownloadPdfInformService,
    private readonly sanitizer: DomSanitizer,
    private readonly clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.cryptsService.clearListByKey(ListResponse.V2_LISTS);
    this.socketConnect();

    this.getSelectedPlan();
    if (this.selectedPlan) {
      this.getPackagesBySubscription(this.selectedPlan.subscription_id);
    }
  }

  loadCountries() {
    let user = this.cryptsService.decryptData(ListResponse.USER);
    this.countries = user?.countries;

    if (this.countries?.length > 0) {
      let countriesObservables = [];
      for (const country of this.countries) {
        countriesObservables.push(
          this.requestListsService.getDocumentTypeByCountry(country.country_id)
        );
      }
      this.identityTypesFiltered = [];
      this.countriesFiltered = [];
      zip(countriesObservables).subscribe({
        next: (responses) => {
          for (let indexCountry = 0; indexCountry < responses.length; indexCountry++) {
            const responseByCountry = responses[indexCountry];
            const documentResult = responseByCountry.data?.find(
              (document: any) => document.person_type === this.selectedPersonType
            );
            if (documentResult) {
              for (const documentCountry of responseByCountry.data) {
                this.identityTypesFiltered.push(documentCountry);
                this.countriesFiltered.push(this.countries[indexCountry]);
              }

              const countryFormControl = this.formRequest.get('country');
              if (countryFormControl) {
                const firstCountry = this.countries[indexCountry];
                countryFormControl.setValue(firstCountry);
                this.changeCountry(firstCountry);
              }
            }
          }
          this.identityTypesAvailable = this.identityTypesFiltered.filter(
            (identityType: { person_type: number }) =>
              identityType.person_type === this.selectedPersonType ||
              identityType.person_type === TypeOfPerson.HYBRID
          );
        },
      });
    }
  }

  socketConnect() {
    const socket = new WebSocketSubject(environment.socketApi);
    const messages = socket.asObservable();

    // Request to start connection
    socket.next({ action: 'getConnectionId', message: '' });

    // Manage income messages
    messages.subscribe({
      next: (message) => {
        switch (typeof message) {
          case 'string':
            const connectionId = message;
            this.cryptsService.cryptData(ListResponse.SOCKET, connectionId);
            this.connectionId = connectionId;
            break;
          case 'object':
            const crawlerResponse = message;
            const document = this.updateDocument(crawlerResponse);
            this.transportDataWsService.message.emit(document);

            this.payloadToGetPdfInform = document;
            this.enableGetPdfInform();
            break;
        }
      },
    });
  }

  updateDocument(crawlerResponse: any) {
    let document = this.cryptsService.decryptData(ListResponse.V2_LISTS);
    const position = crawlerResponse?.body?.request_detail?.position;

    //crawlerResponse.statusCode = 200;
    let crawlerData = document.detail[position];
    crawlerData.body = crawlerResponse?.body;
    crawlerData.statusCode = crawlerResponse?.statusCode;
    crawlerData.body.statusCode = crawlerResponse?.statusCode;
    crawlerData.finding = crawlerResponse?.finding;

    document.detail[position] = crawlerData;

    this.cryptsService.cryptData(ListResponse.V2_LISTS, document);
    return document;
  }

  async enableGetPdfInform() {
    const totalCrawlers: number = this.payloadToGetPdfInform?.detail?.length ?? 0;
    let totalCrawlersStatusResponse: number = 0;

    await this.payloadToGetPdfInform?.detail.forEach((detail) => {
      if (detail.statusCode !== 202) {
        totalCrawlersStatusResponse++;
      }
    });

    const averageCrawler = (totalCrawlersStatusResponse / totalCrawlers) * 100;
    if (averageCrawler >= this.average) {
      this.enableGetPdfInformConfirm = true;
    }
  }

  changeCountry($event: any) {
    this.formRequest.controls['id_type'].setValue(undefined);
    this.formRequest.controls['id_number'].setValue(undefined);
    this.formRequest.controls['name'].setValue(undefined);
  }

  requestInform() {
    if (!this.connectionId) {
      this.notification.error('WS connect', 'Contacte al administrador');
      return;
    }
    this.spinner.show();
    if (!this.formRequest.valid) {
      this.spinner.hide();
      return;
    }
    const data = this.formRequest.value;

    const selectedPackages = this.selectedPackages
      .filter((item) => item.selected)
      .map((item) => item.packageId)
      .join(';');

    const payload: RequestList = {
      country: data.country.country_id,
      id_type: data.id_type.id_type,
      id_number: data.id_number,
      name: data.name ?? '',
      connection_id: this.connectionId,
      holder_authorization: data.holder_authorization,
      packages: selectedPackages,
      subscription_id: this.selectedPlan?.subscription_id!,
    };

    this.requestListsService.lists(payload).subscribe({
      next: (response: ResponseList) => {
        this.spinner.hide();
        this.cryptsService.cryptData(ListResponse.V2_LISTS, response);
        this.showResult = !this.showResult;
        this.payloadPdf = {
          index: response.indexname,
          document_id: response.document_id,
        };
        setTimeout(() => {
          const infoPerson = { ...payload, ...{ id_type_description: data.id_type.description } };
          this.transportDataWsService.setInfoPerson(infoPerson);
        }, 1000);
      },
      error: () => {
        this.spinner.hide();
        this.notification.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  clearResult() {
    this.showResult = false;

    //const dataToPatch = { country: this.formRequest.value.country, holder_authorization: true };
    const dataToPatch = { holder_authorization: true };
    this.formRequest.reset(dataToPatch);

    this.succeedList = [];
    this.failedList = [];

    this.selectedPackages = this.packagesFiltered.map((item) => ({
      packageId: item.package_id,
      selected: item.checked,
    }));

    this.loadCountries();
  }

  downloadPdfInform($event: boolean) {
    if (!$event) false;
    if (!this.payloadToGetPdfInform) return;
    this.isOkLoading = true;
    const payload: PayloadPDF = {
      index: this.payloadPdf?.index ?? '',
      document_id: this.payloadPdf?.document_id ?? '',
    };
    this.isVisible = true;
    this.downloadPdfInformService.downloadPdf(payload).subscribe((reponse) => {
      if (reponse?.body?.pdfLink && reponse?.statusCode === 200) {
        this.pdfRenderUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reponse?.body?.pdfLink);
        this.isOkLoading = true;
      }
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.pdfRenderUrl = undefined;
  }
  handleOk() {
    window.open(this.urlPdf, '_blank');
  }

  selectPersonType(personType: number) {
    this.selectedPersonType = <TypeOfPerson>(<unknown>personType);
    this.loadCountries();
    this.packagesFiltered = this.packages.filter(
      (packageItem) =>
        this.selectedPersonType === packageItem.person_type ||
        packageItem.person_type === TypeOfPerson.HYBRID
    );
    this.selectedPackages = this.packagesFiltered.map((item) => ({
      packageId: item.package_id,
      selected: item.checked,
    }));

    const dataToPatch = { country: this.formRequest.value.country, holder_authorization: true };
    this.formRequest.reset(dataToPatch, { emitEvent: false });
  }

  getSelectedPlan() {
    this.selectedPlan = this.cryptsService.decryptData(ListResponse.PLAN);
  }

  getPackagesBySubscription(subscriptionId: string) {
    this.clientService.getPackagesBySubscription(subscriptionId).subscribe({
      next: (response) => {
        this.packages = <Array<Package>>response.data;

        for (const packageItem of this.packages) {
          packageItem.checked = Number(packageItem.checked) ? true : false;
        }
      },
    });
  }

  get checkSelectedPackages() {
    return this.selectedPackages.find((item) => item.selected) ? true : false;
  }

  onSelectDocumentType(documentType?: any) {
    if (documentType) {
      const index = this.identityTypesFiltered.findIndex(
        (identityType: any) => identityType.id == documentType.id
      );
      const countryFormControl = this.formRequest.get('country');
      const country = this.countriesFiltered[index];
      if (countryFormControl) {
        countryFormControl.setValue(country);
      }

      this.packagesFiltered = this.packages.filter(
        (packageItem) =>
          (this.selectedPersonType === packageItem.person_type ||
            packageItem.person_type === TypeOfPerson.HYBRID) &&
          country.country_id == packageItem.country_id
      );
      this.selectedPackages = this.packagesFiltered.map((item) => ({
        packageId: item.package_id,
        selected: item.checked,
      }));
    }
  }
}
