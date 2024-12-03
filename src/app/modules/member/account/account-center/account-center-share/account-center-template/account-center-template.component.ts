import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-center-template',
  templateUrl: './account-center-template.component.html',
  styleUrls: ['./account-center-template.component.css']
})
export class AccountCenterTemplateComponent {
  activeTab: string = 'profile';
  private router = inject(Router);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //console.log(this.route.snapshot);
    //console.log(window.location.href);
    //console.log(this.router);
    //console.log(this.router.url);
    //var splitted = this.router.url.split("/", 5);
    //console.log(splitted);
    //console.log(splitted[4]);
    const currentPath = this.getCurrentRoute(3) || 'base';
    //alert(currentPath);
    //console.log(this.route);
    //const currentPath = this.route.snapshot.routeConfig?.path || 'base';
    //console.log('當前路徑:', currentPath);
    //alert(currentPath);
    this.activeTab =  currentPath;
  }
  getCurrentRoute(index: number): string {
    return this.activeTab = this.router.url.split("/", index+1)[index];
  }
}
