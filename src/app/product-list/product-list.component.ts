import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { ProductService } from '../services/product.service';
import {Observable} from 'rxjs';
import {Product} from '../product';
import {switchMap} from 'rxjs/operators';
import {CartService} from '../services/cart.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Observable<Product[]>;


  constructor(private productService: ProductService,
              private router: Router,
              private activateRoute: ActivatedRoute,
              private cartService: CartService,) {
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {

    this.products = this.activateRoute.queryParams.pipe(switchMap(product => {
      return this.productService.getProducts(Object.entries(product)[0][0], Object.entries(product)[0][1])
    }));
  }

  addToComparison(product: Product) {
    this.productService.addToComparison(product)
  }
}
