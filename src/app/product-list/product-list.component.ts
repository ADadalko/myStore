import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { ProductService } from '../services/product.service';
import {Observable} from 'rxjs';
import {Product} from '../models/product';
import {switchMap} from 'rxjs/operators';
import {CartService} from '../services/cart.service';
import {LocalstorageService} from '../services/localstorage.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Observable<Product[]>;
  itemsInComparison = [];
  comparison

  constructor(private productService: ProductService,
              private router: Router,
              private activateRoute: ActivatedRoute,
              private cartService: CartService,
              private localSt: LocalstorageService,
              ) {
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    this.localSt.watch('comparison').subscribe(t=>{
      if(t?.id) {
        this.itemsInComparison = t?.id
      }
    })
    this.products = this.activateRoute.queryParams.pipe(switchMap(product => {
      if(Object.entries(product).length == 4) return this.productService.getProductsByFilters(
        Object.entries(product)[0][1],
        Object.entries(product)[1][1],
        Object.entries(product)[2][1],
        Object.entries(product)[3][1],
        );
      if(Object.entries(product).length == 2) return this.productService.getSearchProducts(Object.entries(product)[0][1])
      else return this.productService.getProducts(Object.entries(product)[0][0], Object.entries(product)[0][1]);
    }));
  }

  addToComparison(product: Product){
    this.productService.addToComparison(product)
    if(this.localSt.get('comparison')){
      this.itemsInComparison = this.localSt.get('comparison').id;
    }
    this.comparison = this.productService.getComparison()
  }
}
