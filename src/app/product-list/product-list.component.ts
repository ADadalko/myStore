import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../services/product.service';
import {Subscription} from 'rxjs';
import {Product} from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[];
  product: Product[];
  type: string;
  private querySubscription: Subscription;

  constructor(private productService: ProductService, private activateRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.productService.getProductById(1).subscribe(product => {
      this.product = product;
    });

    this.querySubscription = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        this.type = queryParam['type'];
        console.log(this.type)
      }
    );

    this.productService.getProducts(this.type).subscribe(products => {
      this.products = products;
      console.log(this.products[0].chars);
      for (const [key, value] of Object.entries(this.products[0].chars)) {
        console.log(`${key}: ${value}`);
      }
    })
  }
}
