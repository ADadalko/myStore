import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Cart} from '../models/cart';
import {CartService} from '../services/cart.service';
import {User} from '../models/user';
import {LoginService} from '../services/login.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart: Observable<Cart>;
  user: Observable<User>;
  currentYear: number = new Date().getFullYear();
  updateDelivery: boolean = false;
  updateCard: boolean = false;
  @ViewChild('month') month: ElementRef;
  @ViewChild('year') year: ElementRef;
  content: string = 'delivery';

  delivery = this.fb.group({
    city: ['', [Validators.required]],
    street: ['', [Validators.required]],
    house: ['', [Validators.required]],
    flat: ['', [Validators.required]]
  });

  card = this.fb.group({
    number: ['', [Validators.required]],
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    cvv: ['', [Validators.required]]
  });

  constructor(
    private cartService: CartService,
    private loginService: LoginService,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
   this.cart = this.cartService.getCart();
   this.user = this.loginService.getUser();
  }

  addDelivery(uid: string, city: string, street: string, house: string, flat: string) {
    this.loginService.addDeliveryInfo(uid, city, street, parseInt(house), parseInt(flat))
    this.delivery.reset()
    this.updateDelivery = false;
  }

  addCard(uid: string, number: string, month: string, year: string, cvv: string) {
    if(parseInt(month) < 1 || parseInt(month) > 12)
      this.month.nativeElement.value = 1
    if(parseInt(year) < 2021 || parseInt(year) > 2025)
      this.year.nativeElement.value = 2021
    this.loginService.addCardInfo(uid, number, month, year, cvv)
    this.card.reset()
    this.updateCard = false;
  }

  outMonth(month: string) {
    if (month.length == 1) {
      this.month.nativeElement.value = 0 + month;
    }
    if (month == '0' || month == '00') {
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

  purchase(email: string,
           addressCity: string,
           addressStreet: string,
           addressHouse: string,
           addressFlat: string,
           cardNumber: string,
           cardMonth: string,
           cardYear: string,
           cardCvv: string,
           bill: string,
           uid: string) {
    this.content = 'thanks'
    this.cartService.completePurchase(email,
      addressCity,
      addressStreet,
      addressHouse,
      addressFlat,
      cardNumber,
      cardMonth,
      cardYear,
      cardCvv,
      bill,
      uid
      );
  }
}
