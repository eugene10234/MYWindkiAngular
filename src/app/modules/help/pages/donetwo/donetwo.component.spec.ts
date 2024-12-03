import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonetwoComponent } from './donetwo.component';

describe('DonetwoComponent', () => {
  let component: DonetwoComponent;
  let fixture: ComponentFixture<DonetwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonetwoComponent]
    });
    fixture = TestBed.createComponent(DonetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
