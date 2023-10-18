import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransportDataWsService } from 'src/app/services/tranport-data-ws/transport-data-ws.service';

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class CardHeaderComponent {
  @Input() data: any;
  @Input() country: any;
  @Input() hideAndicomData: boolean = false;
  @Input() showConfirmButtonAverage: boolean = true;
  @Output() eventPdfButton = new EventEmitter<boolean>();
  @Output() eventLinkedinButtonButton = new EventEmitter<boolean>();
  @Input() percent: number = 1;
  totalList: number = 0;
  listLoaded: number = 0;

  infoPerson?: any;

  now: Date = new Date();

  constructor(private _transportDataWsService: TransportDataWsService) {
    this._transportDataWsService.infoPerson.subscribe((info) => {
      this.infoPerson = info;
    });
    this._transportDataWsService.percent.subscribe((percent) => {
      this.percent = percent?.percent;
      this.totalList = percent?.totalList;
      this.listLoaded = Math.round((this.totalList * percent?.percent) / 100);
    });
  }

  downloadPdfInform() {
    this.eventPdfButton.emit(true);
  }

  downloadLinkedinCertificate() {
    this.eventLinkedinButtonButton.emit(true);
  }
}
