import { TestBed } from '@angular/core/testing';

import { RequestListsService } from './request-lists.service';

describe('RequestListsService', () => {
  let service: RequestListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestListsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
