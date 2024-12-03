import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranRecordComponent } from './tran-record.component';

describe('TranRecordComponent', () => {
  let component: TranRecordComponent;
  let fixture: ComponentFixture<TranRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranRecordComponent]
    });
    fixture = TestBed.createComponent(TranRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
