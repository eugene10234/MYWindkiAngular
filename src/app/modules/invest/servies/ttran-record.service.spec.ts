import { TestBed } from '@angular/core/testing';

import { TTranRecordService } from './ttran-record.service';

describe('TTranRecordService', () => {
  let service: TTranRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TTranRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
