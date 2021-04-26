import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {LoginService} from '../services/login.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {User} from '../models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: Observable<User>;
  view: string = 'personal';
  @Output() isLogOut = new EventEmitter<void>()

  form = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })

  delivery = this.fb.group({
    city: ['', [Validators.required]],
    street: ['', [Validators.required]],
    house: ['', [Validators.required]],
    flat: ['', [Validators.required]]
  })

  constructor(public loginService: LoginService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user = this.loginService.getUser()
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  get city() {
    return this.form.get('city')
  }

  get street() {
    return this.form.get('street')
  }

  addDelivery(uid: string, city: string, street: string, house: string, flat: string) {
    this.loginService.addDeliveryInfo(uid, city, street, parseInt(house), parseInt(flat))
  }

  logOut() {
    this.loginService.logOut()
    this.isLogOut.emit()
  }
}
