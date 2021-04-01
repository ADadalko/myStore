import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {CartService} from '../services/cart.service';
import {ProductService} from '../services/product.service';
import {Product} from '../product';
import {Review} from '../review';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import firebase from 'firebase';
import {Observable, Subscription} from 'rxjs';
import Timestamp = firebase.firestore.Timestamp;
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  products: Observable<Product[]>;
  averageMark;
  numberOfMarks;
  productId;

  reviewForm : FormGroup = new FormGroup({
    "userName": new FormControl("", Validators.required),
    "review": new FormControl("", Validators.required),
    "rating": new FormControl()
  })

  constructor(
    private activateRoute: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService
  ) { }

  addToCart(product): void {
    this.cartService.addToCart(product);
    window.alert('Товар был добавлен в корзину!');
  }

  ngOnInit(): void {

    this.products = this.activateRoute.params.pipe(switchMap(params=>{
      this.productId = parseInt(params['productId']);
      return this.productService.getProductById(this.productId).pipe(
        map(product=>{
            let sum: number = 0;
            let marks = [];
            for(let i of product[0].reviews){
              sum += parseInt(String(i.rating));
              marks.push(i.rating);
            }
            this.averageMark = Math.round(sum/marks.length);
            this.numberOfMarks = marks.length
          return product
      })
      )
    }))
  }

  submit() {
    this.productService.addReview(
      this.reviewForm.value.userName,
      this.reviewForm.value.review,
      this.reviewForm.value.rating,
      Timestamp.now(),
      this.productId
    )
    this.reviewForm.reset();
  }
}
