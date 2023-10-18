import { TestBed } from '@angular/core/testing';

import { DownloadPdfInformService } from './download-pdf-inform.service';

describe('DownloadPdfInformService', () => {
  let service: DownloadPdfInformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadPdfInformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
