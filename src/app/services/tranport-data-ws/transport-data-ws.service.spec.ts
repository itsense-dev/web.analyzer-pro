import { TestBed } from '@angular/core/testing';

import { TransportDataWsService } from './transport-data-ws.service';

describe('TransportDataWsService', () => {
  let service: TransportDataWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportDataWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
