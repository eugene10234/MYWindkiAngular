import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInvestComponent } from './general-invest.component';

describe('GeneralInvestComponent', () => {
  let component: GeneralInvestComponent;
  let fixture: ComponentFixture<GeneralInvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralInvestComponent]
    });
    fixture = TestBed.createComponent(GeneralInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
