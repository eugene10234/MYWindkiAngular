import { Component, inject, ViewChild } from '@angular/core';
import { LoginComponent } from '../login-pop/login.component';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { NavlogComponent } from "./navlog/navlog.component";


@Component({
  selector: 'app-wandkinavbar',
  templateUrl: './wandkinavbar.component.html',
  styleUrls: ['./wandkinavbar.component.css'],

})
export class WandkinavbarComponent {
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;
  loginstatus: string = 'block';
  loginService = inject(LoginService);
  openChild(){
    //console.log(this.loginService.getpayload());
    //this.loginComponent.openForm();
  }
}
