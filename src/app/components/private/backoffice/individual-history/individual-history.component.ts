import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { DownloadPdfInformService } from 'src/app/services/download-pdf-inform/download-pdf-inform.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { Roles } from 'src/enum/roles.enum';
import { Routes } from 'src/enum/routes.enum';
import { StatusCode } from 'src/enum/status-code.enum';
import { ApiResponse } from 'src/models/api-response.model';
import {
  Clients,
  HistoryIndividualFilter,
  Countries,
  Plan,
  IndividualHistory,
  ResponseGlobal,
  GlobalHistory,
} from 'src/models/clientes.interface';
import { PayloadPDF } from 'src/models/websocket-response.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-individual-history',
  templateUrl: './individual-history.component.html',
  styleUrls: ['./individual-history.component.scss'],
})
export class IndividualHistoryComponent implements OnInit {
  selectedStartDate: Date[] = [];
  selectedEndDate: Date[] = [];

  country_id: string = 'CO';
  countryList: Countries[] = [];
  filter: string = '';
  name: string = '';
  clientsList: Clients[] = [];
  historyList: IndividualHistory[] = [];
  plansList: Plan[] = [];
  isVisible = false;
  pageIndex = 1;
  pageSize = 10;
  rolId = 0;
  totalRows = 0;
  baseRoles = Roles;

  constructor(
    private analyzerProService: AnalyzerProService,
    private downloadPdfService: DownloadPdfInformService,
    private cryptService: CryptsService,
    private notificationService: NzNotificationService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    const decriptSession = this.cryptService.decryptData(ListResponse.USER);
    this.rolId = decriptSession?.user_info?.rol_id;
    this.getAllCountries();
    this.getAllClientsList();
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

  getAllCountries() {
    this.analyzerProService.getCountries().subscribe({
      next: (response: any) => {
        this.countryList = response.data;
      },
      error: (error) => {
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  searchHistoric() {
    if ((this.country_id == '' || this.name == '') && this.rolId == this.baseRoles.SUPER_ADMIN) {
      this.notificationService.error(Messages.INPUT_REQUIRED, Messages.INPUT_REQUIRED_MESSAGE);
      return;
    } else if (this.country_id == '' && this.rolId != this.baseRoles.SUPER_ADMIN) {
      this.notificationService.error(Messages.INPUT_REQUIRED, Messages.INPUT_REQUIRED_MESSAGE);
      return;
    }

    const payload: HistoryIndividualFilter = {
      country_code: this.country_id,
      key_word: null,
      start_date: null,
      final_date: null,
      client_name: null,
    };

    if (this.rolId == this.baseRoles.SUPER_ADMIN) {
      payload.client_name = this.name.toLowerCase();
    }

    if (this.filter != '') {
      payload.key_word = this.filter;
    }

    if (this.selectedStartDate.length > 0 && this.selectedEndDate.length > 0) {
      payload.start_date = this.selectedStartDate[0].toISOString().split('T')[0];
      payload.final_date = this.selectedEndDate[1].toISOString().split('T')[0];
    }

    this.spinnerService.show();
    this.analyzerProService
      .getIndividualHistoric(payload, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response: ResponseGlobal<GlobalHistory<IndividualHistory[]>>) => {
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

  downloadReport(history: IndividualHistory) {
    const payload = {
      index: history.index_name,
      document_id: history.consult_id,
    } as PayloadPDF;

    this.spinnerService.show();
    this.downloadPdfService.downloadPdf(payload).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        window.open(response.body.pdfLink, '_blank');
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

  onPageIndexChange(page: number) {
    this.pageIndex = page;
    this.searchHistoric();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.searchHistoric();
  }

  cleanFilters() {
    this.selectedStartDate = [];
    this.selectedEndDate = [];
    this.filter = '';
    this.country_id = '';
    this.historyList = [];
    this.name = '';
  }

  redirectView() {
    this.router.navigateByUrl(Routes.SINGLE_QUERY);
  }
}
