import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakesureComponent } from './makesure.component';

describe('MakesureComponent', () => {
  let component: MakesureComponent;
  let fixture: ComponentFixture<MakesureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakesureComponent]
    });
    fixture = TestBed.createComponent(MakesureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
