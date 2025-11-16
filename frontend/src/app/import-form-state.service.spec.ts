import { TestBed } from '@angular/core/testing';

import { ImportFormStateService } from './import-form-state.service';

describe('ImportFormStateService', () => {
  let service: ImportFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportFormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
