import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpingComponent } from './helping.component';

describe('HelpingComponent', () => {
  let component: HelpingComponent;
  let fixture: ComponentFixture<HelpingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpingComponent]
    });
    fixture = TestBed.createComponent(HelpingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
