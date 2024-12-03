import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavlogComponent } from './navlog.component';

describe('NavlogComponent', () => {
  let component: NavlogComponent;
  let fixture: ComponentFixture<NavlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavlogComponent]
    });
    fixture = TestBed.createComponent(NavlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
