import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import {FormBuilder, Validators} from '@angular/forms';
import {providerDef} from '@angular/compiler/src/view_compiler/provider_compiler';
import {Observable} from 'rxjs';
import {Product} from '../product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  //items = [];
  items: Product[] = [];
  checkoutForm = this.formBuilder.group({
    name: '',
    address: ''
  });
  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.items = this.cartService.getItems()
  }

  onSubmit(): void {
    this.items = this.cartService.clearCart();
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
  }

  clearCart(): void{
    this.cartService.clearCart();
  }
}
