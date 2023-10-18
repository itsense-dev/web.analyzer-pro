import { TestBed } from '@angular/core/testing';

import { AnalyzerProService } from './analyzer-pro.service';

describe('AnalyzerProService', () => {
  let service: AnalyzerProService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyzerProService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
