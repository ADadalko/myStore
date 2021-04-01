import {AfterViewInit, Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap, map, filter} from 'rxjs/operators';
import {fromEvent, Observable, Subject} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Product} from '../product';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  searchResults: Observable<Product[]>;
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // const searchBox = document.getElementById('search');
    // this.searchResults = fromEvent(searchBox, 'input').pipe(
    //   map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
    //   distinctUntilChanged(),
    //   switchMap(searchTerm => {
    //     return this.productService.getProducts('model', `${searchTerm}`)
    //   })
    // )
    this.searchResults = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(30),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.productService.getProducts('model', `${term}`)),
    );
  }



  openNav(): void{
    document.getElementById("mySidenav").style.width == "0px"?
      document.getElementById("mySidenav").style.width = "250px":
        document.getElementById("mySidenav").style.width = "0px";
  }
}
