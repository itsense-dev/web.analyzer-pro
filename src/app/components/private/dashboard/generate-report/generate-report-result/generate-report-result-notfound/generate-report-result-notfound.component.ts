import { Component, Input, OnInit } from '@angular/core';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';
import { RequestListsService } from 'src/services/request-list/request-lists.service';

@Component({
  selector: 'app-generate-report-result-notfound',
  templateUrl: './generate-report-result-notfound.component.html',
  styleUrls: ['./generate-report-result-notfound.component.scss'],
})
export class GenerateReportResultNotfoundComponent implements OnInit {
  crawlersFailed: any[] = [];
  currentPanelActive?: any;
  panels: any = [];
  totalList: number = 0;
  totalFinished: number = 0;
  findingNumbers: number = 0;
  showNotification: boolean = false;

  documentId?: string;
  elasticIndex?: string;

  constructor(
    private _transportDataWsService: TransportDataWsService,
    private readonly requestListsService: RequestListsService
  ) {}

  ngOnInit(): void {
    this._transportDataWsService.message.subscribe((message) => {
      this.concatDataWithWs(message);
    });
  }

  concatDataWithWs(data: any) {
    const allLists = <Array<any>>data.detail;
    if (allLists) {
      this.crawlersFailed = allLists.filter((crawler) => crawler.statusCode >= 400);
      if (allLists.length > 0) {
        this.documentId = allLists[0].body?.request_detail?.document_id;
        this.elasticIndex = allLists[0].body?.request_detail?.elastic_index;
      }
    }
  }

  refresh() {
    if (this.documentId && this.elasticIndex)
      this.requestListsService.refreshSources(this.documentId, this.elasticIndex).subscribe();
  }
}
