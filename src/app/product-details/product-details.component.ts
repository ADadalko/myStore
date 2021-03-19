import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CartService } from '../services/cart.service';
import {ProductService} from '../services/product.service';
import {Product} from '../product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  products: Product[];

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
    });

  }
}
