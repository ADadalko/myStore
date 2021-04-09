import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import {Observable} from 'rxjs';
import {Cart} from '../cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Observable<Cart>;

  constructor(
    private cartService: CartService,
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
}
