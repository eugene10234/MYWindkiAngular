import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/login-helper/guard/auth.guard';


const routes: Routes = [
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then(m => m.PasswordModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  }
];
@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule
  ]
})
export class MemberModule { }
