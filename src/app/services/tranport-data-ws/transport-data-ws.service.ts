import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransportDataWsService {
  public message = new EventEmitter<any>();
  public percent = new EventEmitter<any>();
  public infoPerson = new EventEmitter<any>();
  public quantityFindings = new EventEmitter<number>();
  constructor() {}

  setInfoPerson(data: any) {
    this.infoPerson.emit(data);
  }
}
