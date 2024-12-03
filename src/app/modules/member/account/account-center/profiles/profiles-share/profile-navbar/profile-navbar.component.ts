import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-navbar',
  templateUrl: './profile-navbar.component.html',
  styleUrls: ['./profile-navbar.component.css']
})
export class ProfileNavbarComponent {
  activeTab: string = 'base';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //const currentPath = this.route.snapshot.routeConfig?.path || 'base';
    //console.log('當前路徑:', currentPath);
    //alert(currentPath);
    const currentPath = this.getCurrentRoute() || 'base';
    this.activeTab =  currentPath;
  }
  //@Output() tabChange = new EventEmitter<string>();
  getCurrentRoute(): string {
    return this.router.url.split("/", 5)[4];
  }
  setActiveTab(tab: string) {
    // this.activeTab = tab;
    // this.tabChange.emit(tab);
    this.activeTab = tab;
  }
}
