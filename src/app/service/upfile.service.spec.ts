import { TestBed } from '@angular/core/testing';

import { UpfileService } from './upfile.service';

describe('UpfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpfileService = TestBed.get(UpfileService);
    expect(service).toBeTruthy();
  });
});
