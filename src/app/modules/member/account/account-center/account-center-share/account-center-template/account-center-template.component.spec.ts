import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCenterTemplateComponent } from './account-center-template.component';

describe('AccountCenterTemplateComponent', () => {
  let component: AccountCenterTemplateComponent;
  let fixture: ComponentFixture<AccountCenterTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountCenterTemplateComponent]
    });
    fixture = TestBed.createComponent(AccountCenterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
