import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from './order.component';

describe('OrderComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailComponent]
    });
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
