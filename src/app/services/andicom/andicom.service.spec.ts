import { TestBed } from '@angular/core/testing';

import { AndicomService } from './andicom.service';

describe('AndicomService', () => {
  let service: AndicomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AndicomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
