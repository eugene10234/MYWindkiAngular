import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsignupComponent } from './personsignup.component';

describe('PersonsignupComponent', () => {
  let component: PersonsignupComponent;
  let fixture: ComponentFixture<PersonsignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonsignupComponent]
    });
    fixture = TestBed.createComponent(PersonsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
