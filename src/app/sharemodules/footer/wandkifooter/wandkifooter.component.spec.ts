import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WandkifooterComponent } from './wandkifooter.component';

describe('WandkifooterComponent', () => {
  let component: WandkifooterComponent;
  let fixture: ComponentFixture<WandkifooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WandkifooterComponent]
    });
    fixture = TestBed.createComponent(WandkifooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
