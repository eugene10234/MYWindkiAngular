import { TestBed } from '@angular/core/testing';

import { StockInventoryService } from './stock-inventory.service';

describe('StockInventoryService', () => {
  let service: StockInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
