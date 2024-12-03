import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesTemplateComponent } from './profiles-template.component';

describe('ProfilesTemplateComponent', () => {
  let component: ProfilesTemplateComponent;
  let fixture: ComponentFixture<ProfilesTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilesTemplateComponent]
    });
    fixture = TestBed.createComponent(ProfilesTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
