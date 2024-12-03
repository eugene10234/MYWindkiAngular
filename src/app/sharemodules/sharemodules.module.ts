import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WandkinavbarComponent } from './navbar/wandkinavbar/wandkinavbar.component';
import { WandkifooterComponent } from './footer/wandkifooter/wandkifooter.component';
import { RouterModule, Routes } from '@angular/router'

import { FormsModule } from '@angular/forms';
import { LoginComponent } from './navbar/login-pop/login.component';
import { NavlogComponent } from './navbar/wandkinavbar/navlog/navlog.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

const routes: Routes = [
  {
    path: '', // 注意这里是空字符串
    component: MainpageComponent
  }
];



@NgModule({
  declarations:
  [
    WandkinavbarComponent,
    WandkifooterComponent,
    NavlogComponent,
    LoginComponent,
    MainpageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    GoogleSigninButtonModule,
    RouterModule.forChild(routes)
    ],
  exports: [
    WandkinavbarComponent,
    WandkifooterComponent,
    LoginComponent
    // MainpageComponent

  ]
})
export class SharemodulesModule { }
