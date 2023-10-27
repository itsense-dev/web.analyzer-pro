import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestListsService } from 'src/services/request-list/request-lists.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';

@Component({
  selector: 'app-generate-report-result-expansion',
  templateUrl: './generate-report-result-expansion.component.html',
  styleUrls: ['./generate-report-result-expansion.component.scss'],
})
export class GenerateReportResultExpansionComponent implements OnInit {
  @Input() list: any;

  @Output() setPercent = new EventEmitter<number>();

  panels: any = [];

  stopSocket = environment.socket.timeOut / environment.socket.interval;

  currentPanelActive: number = -1;

  initSocket?: any;

  count: number = 0;

  showNotification: boolean = false;

  findingNumbers: number = 0;

  search: string = '';

  totalList: number = 0;

  totalFinished: number = 0;

  constructor(
    private requestListsService: RequestListsService,
    private notification: NzNotificationService,
    private _transportDataWsService: TransportDataWsService
  ) {}

  ngOnInit(): void {
    this.countList();
    this.mapPanels();
    this._transportDataWsService.message.subscribe((message) => {
      this.concatDataWithWs(message);
    });
  }

  countList() {
    this.totalList = this.list?.detail.length;
  }

  concatDataWithWs(data: any) {
    let dataCopied = JSON.parse(JSON.stringify(data));
    const allLists = <Array<any>>dataCopied.detail;
    const crawlersSuccess = allLists.filter((crawler) => crawler.statusCode < 400);
    dataCopied.detail = crawlersSuccess;

    this.getDataList(dataCopied);
    this.setPercent.emit(5);
  }

  mapPanels() {
    const preloadedPanels = this.list.detail.map((listmap: any, index: number) => {
      return {
        active: index === this.currentPanelActive ?? false,
        disabled: false,
        statusCode: listmap.statusCode,
        name: listmap.product_name,
        body: listmap.body,
        position: listmap.position,
        product_url: listmap.product_url,
        request_product_id: listmap.request_product_id,
        finding: listmap.finding,
        highestLevel: listmap.highest_level ?? false,
      };
    });

    const processedPanels = [];
    for (const panel of preloadedPanels) {
      if (panel.highestLevel) {
        if (panel.statusCode != 202) {
          const panelContent = panel.body?.message;
          const subPanels =
            typeof panelContent === 'string' ? JSON.parse(panelContent) : panelContent;

          if (subPanels && subPanels.length > 0)
            for (const subPanel of subPanels) {
              const target = {
                //active: index === this.currentPanelActive ?? false,
                disabled: false,
                statusCode: subPanel.statusCode,
                name: subPanel.name,
                body: subPanel.body,
                position: subPanel.position,
                product_url: subPanel.url,
                request_product_id: subPanel.request_product_id,
                finding: subPanel.finding,
                highestLevel: subPanel.highest_level ?? false,
              };

              processedPanels.push(target);
            }
        }
        //debugger;
      } else {
        processedPanels.push(panel);
      }
    }
    this.panels = processedPanels;

    this.totalList = this.panels.length;
    this.totalFinished = 0;
    this.findingNumbers = 0;
    for (const sourcePanel of this.panels) {
      if (sourcePanel.statusCode !== 202) this.totalFinished++;
      if (sourcePanel.finding) this.findingNumbers++;
    }
    this._transportDataWsService.quantityFindings.emit(this.findingNumbers);
    const average = Math.round((this.totalFinished * 100) / this.totalList);
    const advanceStatus = {
      percent: average,
      totalList: this.totalList,
    };
    this._transportDataWsService.percent.emit(advanceStatus);

    this.finishSocket();
  }
  async getDataList(data: any) {
    if (!this.list?.request_id) return;
    const payload = {
      index: this.list?.indexname,
      document_id: this.list?.document_id,
    };

    this.list?.detail?.forEach((mainList: any) => {
      data.detail.forEach((bodyList: any) => {
        if (mainList.request_product_id === bodyList.request_product_id) {
          mainList.statusCode = Number(bodyList.statusCode);
          mainList.body = bodyList.body;
          mainList.finding = bodyList.finding;
          mainList.body.statusCode = Number(bodyList.statusCode);
        }
      });
    });
    this.mapPanels();
  }

  getIndexPanel(index: number) {
    this.currentPanelActive = index;
  }

  async finishSocket() {
    this.showNotification = true;
    await this.panels.forEach((item: { statusCode: number }) => {
      if (item.statusCode === 202) {
        this.showNotification = false;
      }
    });

    /* if (this.showNotification) {
      this.notification.success('Exito', 'Se han cargado todas las fuentes', {
        nzPlacement: 'top',
      });
    } */
  }

  getDataObject(message: any): any[] {
    if (!message) return [];
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }
    return Object.entries(message);
  }
}
