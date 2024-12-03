import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesthelprecordComponent } from './requesthelprecord.component';

describe('RequesthelprecordComponent', () => {
  let component: RequesthelprecordComponent;
  let fixture: ComponentFixture<RequesthelprecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequesthelprecordComponent]
    });
    fixture = TestBed.createComponent(RequesthelprecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
