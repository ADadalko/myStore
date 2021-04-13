import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Output() isLogOut = new EventEmitter<void>()
  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.loginService.logOut()
    this.isLogOut.emit()
  }
}
