import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { ForgetComponent } from './forget/forget.component';
import { ResetComponent } from './reset/reset.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: 'forget',
    //canActivate: [authGuard],
    component: ForgetComponent
  },
  {
    path: 'reset',
    //canActivate: [authGuard],
    component: ResetComponent
  }
];

@NgModule({
  declarations: [
    ForgetComponent,
    ResetComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class PasswordModule { }
