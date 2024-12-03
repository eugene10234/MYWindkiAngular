import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilateOrderComponent } from './similate-order.component';

describe('SimilateOrderComponent', () => {
  let component: SimilateOrderComponent;
  let fixture: ComponentFixture<SimilateOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimilateOrderComponent]
    });
    fixture = TestBed.createComponent(SimilateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
