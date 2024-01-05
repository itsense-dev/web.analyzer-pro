import { Component, Input, OnInit } from '@angular/core';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { RequestListsService } from 'src/services/request-list/request-lists.service';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-generate-report-result-notfound',
  templateUrl: './generate-report-result-notfound.component.html',
  styleUrls: ['./generate-report-result-notfound.component.scss'],
})
export class GenerateReportResultNotfoundComponent implements OnInit {
  crawlersFailed: any[] = [];
  crawlersFailedAttempts: any[] = [];

  currentPanelActive?: any;
  panels: any = [];
  totalList: number = 0;
  totalFinished: number = 0;
  findingNumbers: number = 0;
  showNotification: boolean = false;

  documentId?: string;
  elasticIndex?: string;

  isRefreshDisabled: boolean = false;

  constructor(
    private _transportDataWsService: TransportDataWsService,
    private readonly requestListsService: RequestListsService,
    private readonly cryptsService: CryptsService
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

      const crawlersAttempts = <any[]>this.cryptsService.decryptData(ListResponse.V2_LISTS_ATTEMPS);
      const crawlersFailedPositions = this.crawlersFailed.map((crawler) => crawler.position);

      this.crawlersFailedAttempts = crawlersAttempts
        .map((value, index) => ({ value, index }))
        .filter((item) => crawlersFailedPositions.includes(item.index))
        .map((item) => item.value);

      if (
        !this.crawlersFailedAttempts.some((crawlersAttempt) => crawlersAttempt.waiting === true)
      ) {
        this.isRefreshDisabled = false;
      }
    }
  }

  refresh() {
    this.isRefreshDisabled = true;

    if (this.documentId && this.elasticIndex) {
      // setInterval(() => (this.isRefreshDisabled = false), 30000);

      this.requestListsService.refreshSources(this.documentId, this.elasticIndex).subscribe();

      for (let attempt of this.crawlersFailedAttempts) attempt.waiting = true;

      const crawlersAttempts = <any[]>this.cryptsService.decryptData(ListResponse.V2_LISTS_ATTEMPS);
      const crawlersFailedPositions = this.crawlersFailed.map((crawler) => crawler.position);
      for (let position of crawlersFailedPositions) crawlersAttempts[position].waiting = true;

      this.cryptsService.cryptData(ListResponse.V2_LISTS_ATTEMPS, crawlersAttempts);
    } else {
      this.isRefreshDisabled = false;
    }
  }
}
