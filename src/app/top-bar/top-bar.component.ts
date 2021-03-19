import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  openNav(): void{
    document.getElementById("mySidenav").style.width == "0px"?
      document.getElementById("mySidenav").style.width = "250px":
        document.getElementById("mySidenav").style.width = "0px";
  }
}
