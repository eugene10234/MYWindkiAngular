import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketInfoComponent } from './market-info.component';

describe('MarketInfoComponent', () => {
  let component: MarketInfoComponent;
  let fixture: ComponentFixture<MarketInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketInfoComponent]
    });
    fixture = TestBed.createComponent(MarketInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
