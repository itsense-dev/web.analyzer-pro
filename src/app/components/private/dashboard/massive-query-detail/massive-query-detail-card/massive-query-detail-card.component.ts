import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { LoadMassiveDocument, ProgressReport } from 'src/models/load-massive.model';
import { ClientService } from 'src/app/services/apis/client/client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Messages } from 'src/enum/messages.enum';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StatusCode } from 'src/enum/status-code.enum';
import { ReloadMassive } from 'src/models/load-massive.model';

@Component({
  selector: 'app-massive-query-detail-card',
  templateUrl: './massive-query-detail-card.component.html',
  styleUrls: ['./massive-query-detail-card.component.scss'],
})
export class MassiveQueryDetailCardComponent {
  @Input() massiveDocument?: LoadMassiveDocument;

  constructor(
    private readonly router: Router,
    private readonly clientService: ClientService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly notificationService: NzNotificationService
  ) {}

  exportResult() {
    if (!this.massiveDocument) return;

    const anchor = document.createElement('a');
    anchor.href = this.massiveDocument.download_url;
    anchor.click();
  }

  get hasToReload() {
    if (!this.massiveDocument) return undefined;
    const processedDateString: string = this.massiveDocument?.last_modify.slice(0, 23) + 'Z';
    const lastModifyDate: Date = new Date(processedDateString);
    const currentDate: Date = new Date();
    const diferenciaMs: number = Math.abs(lastModifyDate.getTime() - currentDate.getTime());
    const diferenciaMin: number = diferenciaMs / (1000 * 60);
    let hasToReload = false;
    if (
      this.massiveDocument.total_executed !== this.massiveDocument.total_queries &&
      diferenciaMin >= 5
    )
      hasToReload = true;

    return hasToReload;
  }

  get createDate() {
    if (!this.massiveDocument) return undefined;
    return this.getLocalDate(this.massiveDocument.create_date);
  }

  get endDate() {
    if (!this.massiveDocument) return undefined;
    return this.getLocalDate(this.massiveDocument.end_date);
  }

  getLocalDate(utcDate: Date): Date {
    const timeZoneOffset = new Date().getTimezoneOffset();
    const localDate = new Date(new Date(utcDate).getTime() - timeZoneOffset * 60 * 1000);
    return localDate;
  }

  reloadQuery() {
    this.spinnerService.show();

    const payload: ReloadMassive = {
      batch: this.massiveDocument?.current_batch_ix_running || 0,
      document_id: this.massiveDocument?.load_massive_document_id || '',
    };

    this.clientService.reloadMassiveRequest(payload).subscribe({
      next: (response) => {
        if (response.code == StatusCode.OK) {
          window.location.reload();
          this.notificationService.success(
            Messages.RELOAD_SUCCESS,
            Messages.RELOAD_SUCCESS_MESSAGE
          );
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

  getProgressReport() {
    this.spinnerService.show();

    const payload: ProgressReport = {
      country: this.massiveDocument?.country_id || '',
      company_name: this.massiveDocument?.client_name || '',
      document_id: this.massiveDocument?.load_massive_document_id || '',
      loaded_file: this.massiveDocument?.url_file || '',
    };

    this.clientService.getProgressMassiveReport(payload).subscribe({
      next: (response) => {
        if (response.code == StatusCode.OK) {
          const anchor = document.createElement('a');
          anchor.href = response.data;
          anchor.click();
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
}
