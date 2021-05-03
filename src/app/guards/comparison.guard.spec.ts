import { TestBed } from '@angular/core/testing';

import { ComparisonGuard } from './comparison.guard';

describe('ComparisonGuard', () => {
  let guard: ComparisonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComparisonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
