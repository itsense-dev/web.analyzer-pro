import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListResponse } from 'src/enum/list-response.enum';
import { StatusCode } from 'src/enum/status-code.enum';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-generate-report-result',
  templateUrl: './generate-report-result.component.html',
  styleUrls: ['./generate-report-result.component.scss'],
})
export class GenerateReportResultComponent implements OnInit {
  statusCode = StatusCode;
  listOfCrawlers?: any;
  @Input() country?: string;
  @Input() hideAndicomData: boolean = false;
  @Input() showConfirmButtonAverage: boolean = true;
  @Output() eventPdfButton = new EventEmitter<boolean>();
  percent: number = 0;
  @Output() eventLinkedinButtonButton = new EventEmitter<boolean>();
  constructor(private cryptsService: CryptsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.listOfCrawlers = this.cryptsService.decryptData(ListResponse.V2_LISTS);
  }

  downloadPdfInform($event: boolean) {
    this.eventPdfButton.emit($event);
  }

  downloadLinkedinCertificate($event: boolean) {
    this.eventLinkedinButtonButton.emit($event);
  }
}
