import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit() {
    const myCarousel = document.getElementById('carouselId');
    if (myCarousel) {
      new bootstrap.Carousel(myCarousel, {
        interval: 3000,
        wrap: true
      });
    }
  }
}
    // 初始化所有的工具提示



