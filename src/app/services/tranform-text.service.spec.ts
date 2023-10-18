import { TestBed } from '@angular/core/testing';

import { TranformTextService } from './tranform-text.service';

describe('TranformTextService', () => {
  let service: TranformTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranformTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
