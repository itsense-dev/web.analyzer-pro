import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { LoadMassiveDocument } from 'src/models/load-massive.model';

@Component({
  selector: 'app-massive-query-detail-card',
  templateUrl: './massive-query-detail-card.component.html',
  styleUrls: ['./massive-query-detail-card.component.scss'],
})
export class MassiveQueryDetailCardComponent {
  @Input() massiveDocument?: LoadMassiveDocument;
  constructor(private readonly router: Router) {}

  exportResult() {
    if (!this.massiveDocument) return;

    const anchor = document.createElement('a');
    anchor.href = this.massiveDocument.download_url;
    anchor.click();
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
}
