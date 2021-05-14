import {Component, Injectable, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginService} from '../services/login.service';
import {LocalstorageService} from '../services/localstorage.service';
import {Cart} from '../models/cart';
import {CartService} from '../services/cart.service';
import {SearchPipe} from '../pipes/search.pipe';
import {Router} from '@angular/router';
import {FullSearchPipe} from '../pipes/full-search.pipe';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class TopBarComponent implements OnInit, OnChanges {
  products: Observable<Product[]>;
  cart: Observable<Cart>;
  @ViewChild('minPrice') min;
  @ViewChild('maxPrice') max;
  productsForSearch = [];
  productsName: string;
  comparisonLength: number = 0;
  comparison;
  types = [];
  vendors = [];
  filters = [];
  disableType;
  logged: string = localStorage.getItem('user');


  constructor(private productService: ProductService,
              private fb: FormBuilder,
              public loginService: LoginService,
              public localSt: LocalstorageService,
              public cartService: CartService,
              private fullSearchPipe: FullSearchPipe,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.comparison = this.localSt.watch('comparison').subscribe(t => {
      this.comparisonLength = t?.id.length;
      this.productService.getComparison();
      if (t?.id.length) {
        document.getElementById('comparisonDiv').style.display = 'block';
      }
    });
    this.productService.getProducts('type', 'all').subscribe(products => {
      products.forEach(product => {
        this.productsForSearch.push(product);
        if (!this.types.includes(product.type)) {
          this.types.push(product.type);
        }
        if (!this.vendors.includes(product.vendor)) {
          this.vendors.push(product.vendor);
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.logged) {
      document.getElementById('logOut').style.display = 'none';
    }
  }

  openNav(): void {
    document.getElementById('mySidenav').style.width == '0px' ?
      document.getElementById('mySidenav').style.width = '250px' :
      document.getElementById('mySidenav').style.width = '0px';
  }

  logOut() {
    document.getElementById('logOut').style.display = 'none';
    this.loginService.logOut();
  }

  isLogged(): boolean {
    return Boolean(localStorage.getItem('user'));
  }

  isComparisonDisabled(): boolean {
    if (localStorage.getItem('comparison')) {
      return JSON.parse(localStorage.getItem('comparison')).id.length >= 2;
    } else {
      return false;
    }
  }

  clearComparison() {
    this.productService.clearComparison();
  }

  searchFor(productsName: string) {
    this.router.navigate(['/products'], {queryParams: {q: productsName}});
  }

  pushedButton(cat: string, value: string) {
    let agree = true
    if(cat == 'minPrice' || cat == 'maxPrice'){
      this.filters.forEach(filter=>{
        if(filter[0] == cat) {
          filter[1] = value
          agree = false
        }
      })
    }
    if(agree){
      if(value!= '') this.filters.push([cat, value]);
      if (cat != 'minPrice' && cat != 'maxPrice' && cat != 'types') document.getElementById(value).style.border = '2px solid #f73859';
    }
    if(cat == 'types') {
      document.getElementById('phones').style.border = 'none';
      document.getElementById('trackers').style.border = 'none';
      document.getElementById('watches').style.border = 'none';
      document.getElementById('tablets').style.border = 'none';
      document.getElementById('tvs').style.border = 'none';
      document.getElementById(value).style.border = '2px solid #f73859';
    }
  }

  clearFilters() {
    this.min.nativeElement.value = '';
    this.max.nativeElement.value = '';
    this.filters.forEach(item => {
      if (item[0] != 'minPrice' && item[0] != 'maxPrice') {
        document.getElementById(item[1]).style.border = 'none';
      }
    })
    this.filters = []
  }

  submitFilters() {
    let types = [];
    let type = ''
    let vendors = [];
    let minPrice = 0;
    let maxPrice = 0;
    this.filters.forEach(filter=>{
      if(filter[0] == 'types') {
        if(!types.includes(filter[1])) types.push(filter[1])
      }
      if(filter[0] == 'vendors') {
        if(!vendors.includes(filter[1])) vendors.push(filter[1])
      }
      if(filter[0] == 'minPrice') minPrice = filter[1]
      if(filter[0] == 'maxPrice') maxPrice = filter[1]
    })
    if(types.length > 0) type = types[types.length-1]
    this.router.navigate(['/products'], {queryParams: {types: type, vendors: vendors, minPrice: minPrice, maxPrice: maxPrice}});
    this.clearFilters()
  }
}
