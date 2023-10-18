import { TestBed } from '@angular/core/testing';

import { CryptsService } from './crypts.service';

describe('CryptsService', () => {
  let service: CryptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
