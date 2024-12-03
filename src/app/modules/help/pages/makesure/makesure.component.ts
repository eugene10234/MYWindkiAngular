import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-makesure',
  templateUrl: './makesure.component.html',
  styleUrls: ['./makesure.component.css']
})
export class MakesureComponent {
  constructor(private router: Router
  ){}

  makeSure(){
    this.router.navigate(['/help/doneone']);
  }
}
