import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {CartService} from '../services/cart.service';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import firebase from 'firebase';
import {Observable, Subscription} from 'rxjs';
import Timestamp = firebase.firestore.Timestamp;
import {map, switchMap} from 'rxjs/operators';
import {LocalstorageService} from '../services/localstorage.service';
import {User} from '../models/user';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  products: Observable<Product[]>;
  user: Observable<User>;
  @ViewChild('userName') userName: ElementRef;
  comparison: Observable<any>;
  averageMark: number = 0;
  numberOfMarks: number = 0;
  productId: number = 0;
  isLogged: boolean = false;
  itemsInComparison = [];

  reviewForm : FormGroup = new FormGroup({
    "review": new FormControl("", Validators.required),
    "rating": new FormControl(null, [Validators.required])
  })

  constructor(
    private activateRoute: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private localSt: LocalstorageService,
    private loginService: LoginService,
  ) { }

  addToCart(product): void {
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    if(localStorage.getItem('user')) {
      this.isLogged = true
      this.user = this.loginService.getUser();
    }
    this.localSt.watch('comparison').subscribe(t=>{
      if(t?.id) {
        this.itemsInComparison = t?.id
      }
    })
    this.products = this.activateRoute.params.pipe(switchMap(params=>{
      this.productId = parseInt(params['productId']);
      return this.productService.getProductById(this.productId).pipe(
        map(product=>{
            let sum: number = 0;
            let marks = [];
            if(product[0]?.reviews) {
              for (let i of product[0].reviews) {
                sum += parseInt(String(i.rating));
                marks.push(i.rating);
              }
              this.averageMark = Math.round(sum / marks.length);
              this.numberOfMarks = marks.length
            }
          return product
      })
      )
    }))
  }

  submit() {
    this.productService.addReview(
      this.userName.nativeElement.value,
      this.reviewForm.value.review,
      this.reviewForm.value.rating,
      Timestamp.now(),
      this.productId
    )
    this.reviewForm.reset();
  }

  addToComparison(product: Product) {
    this.productService.addToComparison(product)
    if(this.localSt.get('comparison')){
      this.itemsInComparison = this.localSt.get('comparison').id;
    }
    this.comparison = this.productService.getComparison()
  }
}
