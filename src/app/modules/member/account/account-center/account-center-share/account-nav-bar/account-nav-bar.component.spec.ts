import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNavBarComponent } from './account-nav-bar.component';

describe('AccountNavBarComponent', () => {
  let component: AccountNavBarComponent;
  let fixture: ComponentFixture<AccountNavBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountNavBarComponent]
    });
    fixture = TestBed.createComponent(AccountNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
