import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesthelpsureComponent } from './requesthelpsure.component';

describe('RequesthelpsureComponent', () => {
  let component: RequesthelpsureComponent;
  let fixture: ComponentFixture<RequesthelpsureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequesthelpsureComponent]
    });
    fixture = TestBed.createComponent(RequesthelpsureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
