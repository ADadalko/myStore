import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {map} from 'rxjs/operators';
import {ProductService} from '../services/product.service';
import {luhnValidator} from '../luhnValidator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {

  user: Observable<User>;
  view: string = 'personal';
  max: string;
  currentYear: number = new Date().getFullYear();
  updateDeliveryInfo: boolean = false;
  updateUserInfo: boolean = false;
  updatePersonalInfo: boolean = false;
  updateCardInfo: boolean = false;

  @Output() isLogOut = new EventEmitter<void>();
  @ViewChild('month') month: ElementRef;
  @ViewChild('year') year: ElementRef;
  @ViewChild('birthDay') birthDay: ElementRef;

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

  delivery = this.fb.group({
    city: ['', [Validators.required]],
    street: ['', [Validators.required]],
    house: ['', [Validators.required]],
    flat: ['', [Validators.required]]
  });

  card = this.fb.group({
    number: ['', [Validators.required, luhnValidator()]],
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    cvv: ['', [Validators.required]]
  });

  personalInfo = this.fb.group({
    firstName: ['', [Validators.required]],
    secondName: ['', [Validators.required]],
    birthDay: ['', [Validators.required]],
  });

  constructor(public loginService: LoginService,
              private fb: FormBuilder,
              private productService: ProductService) {
  }

  ngAfterViewInit(): void {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    this.max = `${yyyy}-${mm}-${dd}`;
  }

  ngOnInit(): void {
    this.user = this.loginService.getUser().pipe(
      map(user => {
        user?.purchases.reverse();
        return user;
      })
    );
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  addDelivery(uid: string, city: string, street: string, house: string, flat: string) {
    this.loginService.addDeliveryInfo(uid, city, street, parseInt(house), parseInt(flat));
    this.delivery.reset();
    this.updateDeliveryInfo = false;
  }

  addCard(uid: string, number: string, month: string, year: string, cvv: string) {
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      this.month.nativeElement.value = 1;
    }
    if (parseInt(year) < 2021 || parseInt(year) > 2025) {
      this.year.nativeElement.value = 2021;
    }
    this.loginService.addCardInfo(uid, number, month, year, cvv);
    this.card.reset();
    this.updateCardInfo = false;
  }

  addPersonal(uid: string, firstName: string, secondName: string, birthDay: string) {
    this.loginService.addPersonalInfo(uid, firstName, secondName, birthDay);
    this.personalInfo.reset();
    this.updatePersonalInfo = false;
  }

  logOut() {
    this.loginService.logOut();
    this.isLogOut.emit();
  }

  outMonth(month: string) {
    if (month.length == 1) {
      this.month.nativeElement.value = 0 + month;
    }
    if (month == '0') {
      this.month.nativeElement.value = '01';
    }
    if (parseInt(month) > 12) {
      this.month.nativeElement.value = '12';
    }
  }

  outYear(year: string) {
    if (parseInt(year) < this.currentYear || parseInt(year) > this.currentYear + 50) {
      this.year.nativeElement.value = this.currentYear;
    }
  }

  updateInfo(oldEmail: string, oldPassword: string, email: string, password: string, confirmPassword: string) {
    this.loginService.signIn(oldEmail, oldPassword)
    if (password == confirmPassword) {
      this.loginService.updateInfo(email, confirmPassword);
      this.form.reset();
      this.updateUserInfo = false
    } else {
      this.productService.popup('popupInvalidConfirm', "Passwords Doesn't Match")
    }
  }
}
