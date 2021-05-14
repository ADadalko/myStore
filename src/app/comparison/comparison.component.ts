import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product';
import {LocalstorageService} from '../services/localstorage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {
  items: Observable<Product[]>;
  chars = [];

  constructor(
    private productService: ProductService,
    private localSt: LocalstorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localSt.watch('comparison').subscribe(t=>{
      if(t.id.length < 2 && this.router.url == '/comparison') this.router.navigateByUrl('/')
      this.items = this.productService.getComparison()
    })
  }

  clearComparison() {
    this.productService.clearComparison();
  }


  deleteComparisonItem(id: number, length: number) {
    if(length == 2) this.clearComparison()
    else this.productService.deleteComparisonItem(id)
  }
}
