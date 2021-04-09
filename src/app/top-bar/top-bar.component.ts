import { Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import { Observable, Subject} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Product} from '../product';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  products: Observable<Product[]>;
  productsForSearch = [];
  productsName = ''

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts('type', 'all').subscribe(products=>{
      products.forEach(product => {
        this.productsForSearch.push(product);
      })
    })
  }



  openNav(): void{
    document.getElementById("mySidenav").style.width == "0px"?
      document.getElementById("mySidenav").style.width = "250px":
        document.getElementById("mySidenav").style.width = "0px";
  }
}
