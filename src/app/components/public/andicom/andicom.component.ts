import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebSocketSubject } from 'rxjs/webSocket';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { environment } from 'src/environments/environment';
import { RequestList } from 'src/models/request.interface';
import { ResponseList } from 'src/models/response-list.model';
import { PayloadPDF, WebsocketResponse } from 'src/models/websocket-response.model';
import { RequestListsService } from 'src/services/request-list/request-lists.service';
import { CryptsService } from 'src/services/utils/crypts.service';
import { CognitoUser, CognitoUserSession, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Auth } from '@aws-amplify/auth';
import { CognitoUsersFlow } from 'src/enum/cognito-users-flow.enum';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { DownloadPdfInformService } from 'src/app/services/download-pdf-inform/download-pdf-inform.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Andicom, PayloadGetAttemps } from './models/andicom.interface';
import { CatalogsService } from 'src/app/services/catalogs/catalogs.service';
import { IdTypes } from 'src/models/catalogs.interface';
import { Catalogs } from 'src/enum/catalogs.enum';
import { AndicomService } from 'src/app/services/andicom/andicom.service';
@Component({
  selector: 'app-andicom',
  templateUrl: './andicom.component.html',
  styleUrls: ['./andicom.component.scss'],
})
export class AndicomComponent implements OnInit {
  payloadToGetPdfInform?: WebsocketResponse;
  enableGetPdfInformConfirm: boolean = false;
  average: number = 50;
  connectionId?: string;
  showResult: boolean = false;
  payloadPdf?: PayloadPDF;
  isVisible: BooleanInput;
  isOkLoading: BooleanInput;
  pdfRenderUrl?: SafeResourceUrl;
  urlPdf: string = '';
  decryptQueryParam?: Andicom;
  isVisibleattemps: boolean = false;
  listIdTypes: IdTypes[] = [];
  attemps: number = 0;
  hideAndicomData: boolean = false;
  contador = 0;
  percent = 0;
  constructor(
    private transportDataWsService: TransportDataWsService,
    private cryptsService: CryptsService,
    private notification: NzNotificationService,
    private requestListsService: RequestListsService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private downloadPdfInformService: DownloadPdfInformService,
    private route: ActivatedRoute,
    private catalogsService: CatalogsService,
    private andicomService: AndicomService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.transportDataWsService.percent.subscribe((percent) => {
      this.percent = percent.percent;
    });

    this.transportDataWsService.quantityFindings.subscribe((numbers) => {
      setTimeout(() => {
        if (this.percent === 100) {
          if (numbers === 0) {
            this.hideAndicomData = true;
          } else {
            this.hideAndicomData = false;
          }
        }
      }, 2000);
      this.contador++;
    });

    this.loadIdTypes();
    await sessionStorage.clear();
    await localStorage.clear();

    let queryParam;
    this.route.queryParams.subscribe((params) => {
      if (!params['params']) return;
      queryParam = params['params'];
      queryParam = queryParam.split(/\s+/).join('+');
    });
    if (!queryParam) return;
    const decryptAES = this.cryptsService.decryptString(queryParam);
    this.decryptQueryParam = JSON.parse(decryptAES ?? '');
    await this.getAttemps();
    await this.login();
    await this.socketConnect();
  }

  canGetLinkedInCertificate(data: any) {
    if (!data) return;
    if (typeof data !== 'object') return;
    data?.detail.forEach((items: any) => {
      if (items?.statusCode !== 202) {
        if (this.hideAndicomData) return;
        this.hideAndicomData = items?.finding;
      } else {
        this.hideAndicomData = false;
      }
    });
  }

  payloadToGetAndUpdateAttempts() {
    const payload: PayloadGetAttemps = {
      id_type:
        this.listIdTypes.find((item) => item.description === this.decryptQueryParam?.typeDocument)
          ?.id ?? 1,
      id_number: this.decryptQueryParam?.document!,
    };
    return payload;
  }
  getAttemps() {
    this.andicomService
      .getAtempsByIdTypeAndNumber(this.payloadToGetAndUpdateAttempts())
      .subscribe((response) => {
        this.isVisibleattemps = true;
        this.attemps = response.data[0].attempts;
        if (this.attemps >= 3) {
          window.location.href = environment.webSiteUrl;
          return;
        }
      });
  }

  increaseAttempts() {
    this.andicomService
      .increaseAtempsByIdTypeAndNumber(this.payloadToGetAndUpdateAttempts())
      .subscribe(() => {});
  }

  loadIdTypes() {
    this.catalogsService.getCatalog(Catalogs.ID_TYPE).subscribe((response) => {
      this.listIdTypes = response.data;
    });
  }

  socketConnect() {
    const socket$ = new WebSocketSubject(environment.socketApi);
    const messages$ = socket$.asObservable();
    socket$.next({ action: 'getConnectionId', message: '' });
    messages$.subscribe((connectionId) => {
      const id: any = connectionId;
      this.transportDataWsService.message.emit(id);
      if (typeof id === 'object') {
        this.payloadToGetPdfInform = id;
        this.enableGetPdfInform();
      }
      try {
        const content = JSON.parse(id);
      } catch (e) {
        if (typeof connectionId === 'string') {
          this.cryptsService.cryptData(ListResponse.SOCKET, connectionId);
          this.connectionId = String(connectionId);
          this.requestInform();
        }
      }
    });
  }

  async login() {
    try {
      const perform: CognitoUser = await Auth.signIn(
        environment.andinacom.userCognito,
        environment.andinacom.passwsordCgonito
      );
      const userSession: CognitoUserSession | null = perform.getSignInUserSession();
      if (perform?.challengeName === CognitoUsersFlow.NEW_PASSWORD_REQUIRE) {
        //this.cognitoObject = perform;
        this.notification.warning('Advertencia', 'Es necesario actualizar tu contraseña');
        return;
      }
      if (userSession) {
        this.cryptsService.cryptData(ListResponse.SESSION, userSession);
        //this.getValidateUser();
      }

      if (!perform) throw 'CongnitoExceptions.UNHANDLED';
    } catch (error) {
      this.notification.error('Error', 'Usuario y/o contraseña inválidos');
    }
  }

  async enableGetPdfInform() {
    const totalCrawlers: number = this.payloadToGetPdfInform?.detail?.length ?? 0;
    let totalCrawlersStatusResponse: number = 0;

    await this.payloadToGetPdfInform?.detail?.forEach((detail) => {
      if (detail.statusCode !== 202) {
        totalCrawlersStatusResponse++;
      }
    });

    const averageCrawler = (totalCrawlersStatusResponse / totalCrawlers) * 100;
    if (averageCrawler >= this.average) {
      this.enableGetPdfInformConfirm = true;
    }
  }

  requestInform() {
    if (!this.connectionId) {
      this.notification.error('WS connect', 'Contacte al administrador');
      return;
    }
    // this.spinner.show();

    const payload: RequestList = {
      country: environment.andinacom.defaultCountry,
      id_type: (
        this.listIdTypes.find((item) => item.id === Number(this.decryptQueryParam?.typeDocument))
          ?.id_type ?? ''
      ).trim(),
      id_number: this.decryptQueryParam?.document ?? '',
      name: (this.decryptQueryParam?.name ?? '').trim(),
      connection_id: this.connectionId,
      holder_authorization: true,
      packages: environment.andinacom.packages,
      subscription_id: environment.andinacom.subscription_id,
      parameters: [],
    };

    this.requestListsService.lists(payload).subscribe({
      next: (response: ResponseList) => {
        this.increaseAttempts();
        this.spinner.hide();
        this.cryptsService.cryptData(ListResponse.V2_LISTS, response);
        this.showResult = !this.showResult;
        this.showInfoModal();
        this.payloadPdf = {
          index: response.indexname,
          document_id: response.document_id,
        };
        setTimeout(() => {
          this.transportDataWsService.setInfoPerson(payload);
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

  showInfoModal() {
    setTimeout(() => {
      this.isVisibleattemps = false;
    }, 3000);
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

  shareWithLinekIn($event?: boolean) {
    this.cryptsService.cryptData(ListResponse.SHARE, this.decryptQueryParam);
    this.router.navigate(['/andicom/certificate']);
  }
}
