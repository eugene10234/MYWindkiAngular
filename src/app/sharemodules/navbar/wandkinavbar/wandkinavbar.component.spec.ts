import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WandkinavbarComponent } from './wandkinavbar.component';

describe('WandkinavbarComponent', () => {
  let component: WandkinavbarComponent;
  let fixture: ComponentFixture<WandkinavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WandkinavbarComponent]
    });
    fixture = TestBed.createComponent(WandkinavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
