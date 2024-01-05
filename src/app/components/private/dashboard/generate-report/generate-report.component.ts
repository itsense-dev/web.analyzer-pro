import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ExtraParamDataType, Package, PackageExtraParam } from 'src/models/package.model';
import { Plan } from 'src/models/plan.model';
import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { Routes } from 'src/enum/routes.enum';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
})
export class GenerateReportComponent implements OnInit {
  TypeOfPerson = TypeOfPerson;
  ExtraParamDataType = ExtraParamDataType;

  selectedPersonType?: TypeOfPerson;
  packages: Package[] = [];
  packagesFiltered: Package[] = [];
  selectedPackages: { packageId: number; selected: boolean }[] = [];

  extraParams: PackageExtraParam[] = [];

  selectedPlan?: Plan;

  personTypes = [
    { text: 'naturalPerson', value: TypeOfPerson.NATURAL },
    { text: 'legalPerson', value: TypeOfPerson.LEGAL },
  ];

  countries: { country_name: string; country_id: string }[] = [];
  selectedCountryId?: string;

  identityTypes: any[] = [];
  identityTypesAvailable: any[] = [];

  countriesFiltered: any = [];

  formRequest: FormGroup = new FormGroup({
    id_type: new FormControl(null, [Validators.required]),
    id_number: new FormControl(null, [Validators.required]),
    name: new FormControl(null, []),
    holder_authorization: new FormControl(true, [Validators.requiredTrue]),

    extraParams: new FormGroup({}),
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
    private readonly router: Router,
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
    this.loadCountries();

    this.getSelectedPlan();
    if (this.selectedPlan) {
      this.getPackagesBySubscription(this.selectedPlan.subscription_id);
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
            this.updateAttempt(crawlerResponse);
            this.transportDataWsService.message.emit(document);

            this.payloadToGetPdfInform = document;
            this.enableGetPdfInform();
            break;
        }
      },
    });
  }

  loadCountries() {
    let user = this.cryptsService.decryptData(ListResponse.USER);
    this.countries = user?.countries;

    if (this.countries.some((country) => country.country_id.toUpperCase() == 'CO')) {
      this.selectedCountryId = 'CO';
    }

    this.getDocumentTypes();
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

  updateAttempt(crawlerResponse: any) {
    let crawlersAttempts = this.cryptsService.decryptData(ListResponse.V2_LISTS_ATTEMPS);
    const position = crawlerResponse?.body?.request_detail?.position;

    crawlersAttempts[position] = {
      attempts: crawlerResponse?.body?.request_detail?.n_attempts,
      waiting: false,
    };

    this.cryptsService.cryptData(ListResponse.V2_LISTS_ATTEMPS, crawlersAttempts);
  }

  enableGetPdfInform() {
    const totalCrawlers: number = this.payloadToGetPdfInform?.detail?.length ?? 0;
    let totalCrawlersStatusResponse: number = 0;

    this.payloadToGetPdfInform?.detail.forEach((detail) => {
      if (detail.statusCode !== 202) {
        totalCrawlersStatusResponse++;
      }
    });

    const averageCrawler = (totalCrawlersStatusResponse / totalCrawlers) * 100;
    if (averageCrawler >= this.average) {
      this.enableGetPdfInformConfirm = true;
    }
  }

  onSelectCountry(countryId: string) {
    this.selectedCountryId = countryId;
    this.selectedPersonType = undefined;

    this.getDocumentTypes();
  }

  selectPersonType(personType: TypeOfPerson) {
    this.selectedPersonType = personType;

    this.packagesFiltered = this.packages.filter(
      (packageItem) =>
        (this.selectedPersonType === packageItem.person_type ||
          packageItem.person_type === TypeOfPerson.HYBRID) &&
        this.selectedCountryId == packageItem.country_id
    );
    this.selectedPackages = this.packagesFiltered.map((item) => ({
      packageId: item.package_id,
      selected: item.checked,
    }));

    this.identityTypesAvailable = this.identityTypes.filter(
      (identityType) =>
        identityType.person_type === personType || identityType.person_type === TypeOfPerson.HYBRID
    );

    const dataToPatch = { holder_authorization: true };
    this.formRequest.reset(dataToPatch, { emitEvent: false });

    this.onSelectedPackagesChanged();
  }

  getDocumentTypes() {
    if (this.selectedCountryId) {
      this.requestListsService.getDocumentTypeByCountry(this.selectedCountryId).subscribe({
        next: (response) => {
          this.identityTypes = <Array<any>>response.data;
        },
      });
    }
  }

  getSelectedPlan() {
    this.selectedPlan = this.cryptsService.decryptData(ListResponse.PLAN);
  }

  getPackagesBySubscription(subscriptionId: string) {
    this.spinner.show();
    this.clientService.getPackagesBySubscription(subscriptionId).subscribe({
      next: (response) => {
        this.packages = <Array<Package>>response.data;

        for (const packageItem of this.packages) {
          packageItem.checked = Number(packageItem.checked) ? true : false;
        }
      },
      complete: () => this.spinner.hide(),
    });
  }

  get checkSelectedPackages() {
    return this.selectedPackages.find((item) => item.selected) ? true : false;
  }
  get selectedCountryName() {
    return this.countries.find((country) => country.country_id == this.selectedCountryId)
      ?.country_name;
  }

  handleCancel() {
    this.isVisible = false;
    this.pdfRenderUrl = undefined;
  }

  handleOk() {
    window.open(this.urlPdf, '_blank');
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

    const extraParamsFormValue = Object.entries(this.extraParamsForm.value);
    let parameters: { key: string; value: string }[] = [];
    for (const [paramKey, paramValue] of extraParamsFormValue) {
      const extraParam = this.extraParams.find((extraParam) => extraParam.param_key === paramKey);

      if (!paramValue) continue;

      let valueParsed = paramValue ? String(paramValue) : '';
      switch (extraParam?.data_type) {
        case ExtraParamDataType.DATE:
          valueParsed = valueParsed.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
          break;
      }
      parameters.push({
        key: paramKey,
        value: valueParsed,
      });
    }

    const payload: RequestList = {
      country: this.selectedCountryId!,
      id_type: data.id_type.id_type,
      id_number: data.id_number,
      name: data.name ?? '',
      connection_id: this.connectionId,
      holder_authorization: data.holder_authorization,
      packages: selectedPackages,
      subscription_id: this.selectedPlan?.subscription_id!,
      parameters: parameters,
    };

    this.requestListsService.lists(payload).subscribe({
      next: (response: ResponseList) => {
        this.spinner.hide();
        this.cryptsService.cryptData(ListResponse.V2_LISTS, response);

        // First-version indexer to trace attemps
        const crawlersAttempts = (<any[]>response.detail).map((listItem) => ({
          attempts: listItem.n_attempts,
          waiting: true,
        }));
        this.cryptsService.cryptData(ListResponse.V2_LISTS_ATTEMPS, crawlersAttempts);

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

  clearResult() {
    this.showResult = false;
    this.router.navigateByUrl(Routes.SINGLE_QUERY);
  }

  get extraParamsForm(): FormGroup {
    return <FormGroup>this.formRequest.get('extraParams');
  }

  onSelectedPackagesChanged() {
    let packagesExtraParams: Package[] = [];
    for (const selectedPackage of this.selectedPackages) {
      const packageItem = this.packages.find(
        (packageItem) =>
          selectedPackage.selected && packageItem.package_id == selectedPackage.packageId
      );
      if (packageItem) packagesExtraParams.push(packageItem);
    }

    this.extraParams = [];
    let extraParamsForm = this.extraParamsForm;
    extraParamsForm = new FormGroup({});

    for (const packageExtraParams of packagesExtraParams) {
      for (const extraParam of packageExtraParams.extra_params) {
        this.extraParamsForm.addControl(extraParam.param_key, new FormControl(null, []), {
          emitEvent: false,
        });
        this.extraParams.push(extraParam);
      }
    }
  }
}
