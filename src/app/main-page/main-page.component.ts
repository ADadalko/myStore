import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openNav(): void{
    document.getElementById("mySidenav").style.width = "200px";
  }

  closeNav(): void{
    document.getElementById("mySidenav").style.width = "0";
  }
}
