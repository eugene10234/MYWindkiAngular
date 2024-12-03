import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountCenterTemplateComponent } from './account-center/account-center-share/account-center-template/account-center-template.component';
import { AccountNavBarComponent } from './account-center/account-center-share/account-nav-bar/account-nav-bar.component';
import { ProfilesModule } from './account-center/profiles/profiles.module';
import { AvatarComponent } from './account-center/avatar/avatar.component';
import { CreditComponent } from './account-center/credit/credit.component';
import { UsergroupComponent } from './account-center/usergroup/usergroup.component';
import { PrivacyComponent } from './account-center/privacy/privacy.component';
import { SendmailComponent } from './account-center/sendmail/sendmail.component';
import { PasswordComponent } from './account-center/password/password.component';

const routes: Routes = [
  { path: 'profile',
    loadChildren: () => import('./account-center/profiles/profiles.module').then(m => m.ProfilesModule) },
  { path: 'avatar', component: AccountCenterTemplateComponent},
  { path: 'credit', component: AccountCenterTemplateComponent},
  { path: 'usergroup', component: AccountCenterTemplateComponent},
  { path: 'privacy', component: AccountCenterTemplateComponent},
  { path: 'sendmail', component: AccountCenterTemplateComponent},
  { path: 'password', component: AccountCenterTemplateComponent}
];

@NgModule({
  declarations: [
    AccountCenterTemplateComponent,
    AccountNavBarComponent,
    AvatarComponent,
    CreditComponent,
    UsergroupComponent,
    PrivacyComponent,
    SendmailComponent,
    PasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ProfilesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: []
})
export class AccountModule { }
