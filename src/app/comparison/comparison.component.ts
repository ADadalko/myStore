import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Comparison} from '../models/comparison';
import {map, retry} from 'rxjs/operators';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {
  items: Observable<Comparison>;
  chars = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.items = this.productService.getComparison().pipe(
      map(comparison=>{
        comparison?.items.forEach(item=>{
          console.log(item.chars)
        })
        return comparison
      })
    );
  }

  clearComparison() {
    this.productService.clearComparison();
  }
}
