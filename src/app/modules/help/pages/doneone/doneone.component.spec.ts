import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneoneComponent } from './doneone.component';

describe('DoneoneComponent', () => {
  let component: DoneoneComponent;
  let fixture: ComponentFixture<DoneoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoneoneComponent]
    });
    fixture = TestBed.createComponent(DoneoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
