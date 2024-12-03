import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketIndexComponent } from './market-index.component';

describe('MarketIndexComponent', () => {
  let component: MarketIndexComponent;
  let fixture: ComponentFixture<MarketIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketIndexComponent]
    });
    fixture = TestBed.createComponent(MarketIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
