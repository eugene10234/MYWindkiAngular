import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profiles-template',
  templateUrl: './profiles-template.component.html',
  styleUrls: ['./profiles-template.component.css']
})
export class ProfilesTemplateComponent {
  activeTab: string = 'base';
  //private route = inject(ActivatedRoute);
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
    const currentPath = this.getCurrentRoute(4) || 'base';
    //console.log(this.route);
    //const currentPath = this.route.snapshot.routeConfig?.path || 'base';
    //console.log('當前路徑:', currentPath);
    //alert(currentPath);
    this.activeTab =  currentPath;
  }
  getCurrentRoute(index: number): string {
    return this.router.url.split("/", index+1)[index];
  }
}
