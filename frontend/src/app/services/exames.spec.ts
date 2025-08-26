import { TestBed } from '@angular/core/testing';

import { Exames } from './exames';

describe('Exames', () => {
  let service: Exames;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Exames);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
