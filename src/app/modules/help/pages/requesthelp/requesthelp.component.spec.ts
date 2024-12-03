import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesthelpComponent } from './requesthelp.component';

describe('RequesthelpComponent', () => {
  let component: RequesthelpComponent;
  let fixture: ComponentFixture<RequesthelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequesthelpComponent]
    });
    fixture = TestBed.createComponent(RequesthelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
