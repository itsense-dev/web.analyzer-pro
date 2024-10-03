import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { ClientService } from 'src/app/services/apis/client/client.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { Roles } from 'src/enum/roles.enum';
import { Routes } from 'src/enum/routes.enum';
import { StatusCode } from 'src/enum/status-code.enum';
import {
  Clients,
  GlobalHistory,
  HistoryMassiveFilter,
  MassiveHistory,
  Plan,
  ResponseGlobal,
} from 'src/models/clientes.interface';
import { LoadMassiveDocument, ProgressReport } from 'src/models/load-massive.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-massive-history',
  templateUrl: './massive-history.component.html',
  styleUrls: ['./massive-history.component.scss'],
})
export class MassiveHistoryComponent implements OnInit {
  selectedStartDate: Date[] = [];
  selectedEndDate: Date[] = [];

  filter: string = '';
  clientsList: Clients[] = [];
  plansList: Plan[] = [];
  isVisible = false;
  pageIndex = 1;
  pageSize = 10;
  rolId: number = 0;
  totalRows = 0;
  baseRoles = Roles;
  client_id: number = 0;
  historyList: MassiveHistory[] = [];

  constructor(
    private analyzerProService: AnalyzerProService,
    private cryptService: CryptsService,
    private notificationService: NzNotificationService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private readonly clientService: ClientService
  ) {}

  ngOnInit() {
    const decriptSession = this.cryptService.decryptData(ListResponse.USER);
    this.rolId = decriptSession?.user_info?.rol_id;
    if (this.rolId == this.baseRoles.SUPER_ADMIN) {
      this.getAllClientsList();
    } else {
      this.searchMassiveHistoric();
    }
  }

  closeModal(): void {
    this.isVisible = false;
    this.ngOnInit();
  }

  getAllClientsList() {
    this.analyzerProService.getClientsList().subscribe({
      next: (response: ResponseGlobal<Clients[]>) => {
        this.clientsList = response.data;
      },
      error: (error) => {
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  searchMassiveHistoric() {
    if (this.client_id == 0 && this.rolId == this.baseRoles.SUPER_ADMIN) {
      this.notificationService.error(Messages.INPUT_REQUIRED, Messages.INPUT_REQUIRED_MESSAGE);
      return;
    }

    const payload: HistoryMassiveFilter = {
      is_finished: true,
      key_word: null,
      start_date: null,
      final_date: null,
      client_id: null,
    };

    if (this.rolId == this.baseRoles.SUPER_ADMIN) {
      payload.client_id = this.client_id.toString();
    }

    if (this.filter != '') {
      payload.key_word = this.filter;
    }

    if (this.selectedStartDate.length > 0 && this.selectedEndDate.length > 0) {
      payload.start_date = this.selectedStartDate[0].toISOString().split('T')[0];
      payload.final_date = this.selectedEndDate[1].toISOString().split('T')[0];
    }

    this.spinnerService.show();
    this.analyzerProService.getMassiveHistoric(payload, this.pageIndex, this.pageSize).subscribe({
      next: (response: ResponseGlobal<GlobalHistory<MassiveHistory[]>>) => {
        this.historyList = response?.data?.history_list;
        this.totalRows = response.data.total_rows;
        this.pageIndex = response.data.page;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  downloadLoadedFile(data: MassiveHistory) {
    window.open(data.url_file, '_blank');
  }

  downloadReport(data: MassiveHistory) {
    window.open(data.download_url, '_blank');
  }

  onPageIndexChange(page: number) {
    this.pageIndex = page;
    this.searchMassiveHistoric();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.searchMassiveHistoric();
  }

  cleanFilters() {
    this.selectedStartDate = [];
    this.selectedEndDate = [];
    this.filter = '';
    this.historyList = [];
    this.searchMassiveHistoric();
    this.client_id = 0;
  }

  redirectView() {
    this.router.navigateByUrl(Routes.MASSIVE_QUERY);
  }

  getProgressReport(data: MassiveHistory) {
    this.spinnerService.show();

    const payload: ProgressReport = {
      country: data?.country_id || '',
      company_name: data?.client_name || '',
      document_id: data?.load_massive_document_id || '',
      loaded_file: data?.url_file || '',
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
