import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Cart} from '../models/cart';
import {CartService} from '../services/cart.service';
import {User} from '../models/user';
import {LoginService} from '../services/login.service';
import {FormBuilder, Validators} from '@angular/forms';
import {luhnValidator} from '../luhnValidator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  cart: Observable<Cart>;
  user: Observable<User>;
  currentYear: number = new Date().getFullYear();
  updateDelivery: boolean = false;
  updateCard: boolean = false;
  @ViewChild('month') month: ElementRef;
  @ViewChild('year') year: ElementRef;
  content: string = 'delivery';
  max: string;


  delivery = this.fb.group({
    city: ['', [Validators.required, Validators.maxLength(40)]],
    street: ['', [Validators.required, Validators.maxLength(40)]],
    house: ['', [Validators.required, Validators.min(1)]],
    flat: ['', [Validators.required, Validators.min(1)]]
  });

  card = this.fb.group({
    number: ['', [Validators.required, luhnValidator()]],
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    cvv: ['', [Validators.required]]
  });

  constructor(
    private cartService: CartService,
    private loginService: LoginService,
    private fb: FormBuilder
    ) {}

  ngAfterViewInit(): void{
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    this.max = `${yyyy}-${mm}-${dd}`;
  }

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
    if (parseInt(year) == parseInt(this.max.slice(0, 4)) && parseInt(month) < parseInt(this.max.slice(5, 7)) ) {
      this.loginService.addCardInfo(uid, number, this.max.slice(5, 7), year, cvv);
    }else this.loginService.addCardInfo(uid, number, month, year, cvv);
    this.card.reset()
    this.updateCard = false;
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
