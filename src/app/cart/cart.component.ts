import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import {Observable} from 'rxjs';
import {Cart} from '../models/cart';
import {User} from '../models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Observable<Cart>;
  user: Observable<User>;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart =  this.cartService.getCart()
  }

  clearCart(): void{
    this.cartService.clearCart();
  }

  decreaseQuantity(model: string) {
    this.cartService.decreaseQuantity(model)
  }

  increaseQuantity(model: string) {
    this.cartService.increaseQuantity(model)
  }

  removeItem(model: string, length: number) {
    if (length == 1) {
      this.cartService.clearCart()
      this.router.navigate(['/'])
    }
    else this.cartService.removeItem(model)
  }

  isLogged() {
    return localStorage.getItem('user')
  }
}
