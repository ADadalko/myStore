import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signInView: boolean = true;
  isSignedIn: boolean = false;
  form = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  })

  constructor(public  loginService: LoginService) { }

  ngOnInit(): void {
    this.isSignedIn = localStorage.getItem('user') != null;
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  async onSignup(email: string, password: string) {
    await this.loginService.signUp(email, password)
    if(this.loginService.isLoggedIn)
      this.isSignedIn = true
    this.resetForm()
  }

  async onSignin(email: string, password: string) {
    await this.loginService.signIn(email, password)
    if(this.loginService.isLoggedIn)
      this.isSignedIn = true
    this.resetForm()
  }

  async onSignInWithGoogle() {
    await this.loginService.signInWithGoogle();
    if(this.loginService.isLoggedIn)
      this.isSignedIn = true
  }

  handleLogOut() {
    this.isSignedIn = false
  }

  swapView() {
    this.signInView ?
      this.signInView = false :
      this.signInView = true
  }

  resetForm() {
    this.form.reset()
  }
}
