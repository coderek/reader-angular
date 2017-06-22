import { TestBed, async, inject } from '@angular/core/testing';

import { DomainGuard } from './domain.guard';

describe('DomainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomainGuard]
    });
  });

  it('should ...', inject([DomainGuard], (guard: DomainGuard) => {
    expect(guard).toBeTruthy();
  }));
});
