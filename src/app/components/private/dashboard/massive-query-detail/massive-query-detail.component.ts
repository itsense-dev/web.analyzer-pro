import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientService } from 'src/app/services/apis/client/client.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusCode } from 'src/enum/status-code.enum';
import { Messages } from 'src/enum/messages.enum';
import { LoadMassiveDocument } from 'src/models/load-massive.model';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-massive-query-detail',
  templateUrl: './massive-query-detail.component.html',
  styleUrls: ['./massive-query-detail.component.scss'],
})
export class MassiveQueryDetailComponent implements OnInit, OnDestroy {
  massiveConnectionId?: string;
  massiveQueries: Array<LoadMassiveDocument> = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  intervalId?: NodeJS.Timeout;

  constructor(
    private readonly clientService: ClientService,
    private readonly notificationService: NzNotificationService,
    private readonly spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getMassiveQueryHistory();
    this.socketConnect();
    this.intervalId = setTimeout(() => this.fetchData(), 5000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.intervalId);
  }

  socketConnect() {
    const socket = new WebSocketSubject(environment.socketApi);
    const messages = socket.asObservable();
    socket.next({ action: 'getConnectionId', message: '' });

    messages.subscribe((message) => {
      if (typeof message === 'string') {
        try {
          const content = <LoadMassiveDocument>JSON.parse(message);
          this.updateMassiveQueryElement(content);
        } catch {
          this.massiveConnectionId = String(message);
          this.clientService.saveMassiveConnection(message).subscribe();
        }
      }
    });
  }

  updateMassiveQueryElement(newElement: LoadMassiveDocument) {
    const elementIndex = this.massiveQueries.findIndex(
      (currentElement) =>
        currentElement.load_massive_document_id === newElement.load_massive_document_id
    );
    if (elementIndex >= 0) this.massiveQueries[elementIndex] = newElement;
  }

  getMassiveQueryHistory() {
    this.spinnerService.show();
    this.clientService.getMassiveQueryHistory(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        if (response.code == StatusCode.OK && response.data) {
          this.massiveQueries = response.data.result;
          this.pageIndex = response.data.page;
          this.pageSize = response.data.size;
          this.totalRecords = response.data.totalRecords;
        } else {
          this.notificationService.error(
            Messages.SYSTEM_NOT_AVAILABLE,
            Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
          );
        }
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  pageSizeChange(size: number) {
    this.pageSize = size;
    this.getMassiveQueryHistory();
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getMassiveQueryHistory();
  }

  fetchData() {
    this.clientService.getMassiveQueryHistory(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.massiveQueries = response.data.result;
        this.pageIndex = response.data.page;
        this.pageSize = response.data.size;
        this.totalRecords = response.data.totalRecords;
      },
    });
  }
}
