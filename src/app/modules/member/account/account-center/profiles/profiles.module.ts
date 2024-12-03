
import { ProfilesComponent } from './base/profiles.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileNavbarComponent } from './profiles-share/profile-navbar/profile-navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ContactComponent } from './contact/contact.component';
import { EduComponent } from './edu/edu.component';
import { WorkComponent } from './work/work.component';
import { InfoComponent } from './info/info.component';
import { ProfilesTemplateComponent } from './profiles-share/profiles-template/profiles-template.component';
import { AccountCenterTemplateComponent } from '../account-center-share/account-center-template/account-center-template.component';

const routes: Routes = [
  { path: 'base', component: AccountCenterTemplateComponent},
  { path: 'contact', component: AccountCenterTemplateComponent},
  { path: 'edu', component: AccountCenterTemplateComponent},
  { path: 'work', component: AccountCenterTemplateComponent},
  { path: 'info', component: AccountCenterTemplateComponent},
  { path: '', component: AccountCenterTemplateComponent},
];

@NgModule({
  declarations: [
    ProfilesTemplateComponent,
    ProfilesComponent,
    ContactComponent,
    EduComponent,
    WorkComponent,
    InfoComponent,
    ProfileNavbarComponent,

  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    RadioButtonModule
  ],
  exports: [
    ProfilesTemplateComponent
  ]
})
export class ProfilesModule { }
