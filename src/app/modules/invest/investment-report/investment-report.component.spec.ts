import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentReportComponent } from './investment-report.component';

describe('InvestmentReportComponent', () => {
  let component: InvestmentReportComponent;
  let fixture: ComponentFixture<InvestmentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentReportComponent]
    });
    fixture = TestBed.createComponent(InvestmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
