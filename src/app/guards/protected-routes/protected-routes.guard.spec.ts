import { TestBed } from '@angular/core/testing';

import { ProtectedRoutesGuard } from './protected-routes.guard';

describe('ProtectedRoutesGuard', () => {
  let guard: ProtectedRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectedRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
