import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CartService } from '../services/cart.service';
import {ProductService} from '../services/product.service';
import {Product} from '../product';
import {Review} from '../review';
import firebase from 'firebase';
import TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  products: Product[];
  chars = [];
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService
  ) { }

  addToCart(product): void {
    console.log(product)
    this.cartService.addToCart(product);
    window.alert('Товар был добавлен в корзину!');
  }

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('productId'));
    console.log(productIdFromRoute);

    this.productService.getProductById(productIdFromRoute).subscribe(product => {
      this.products = product;
      for(let entry of Object.entries(this.products[0].chars)){
       this.chars.push(entry)
      }
      for(let value of Object.entries(this.products[0].reviews)) {
        this.reviews.push(value[1]);
      }
    });
  }
}
