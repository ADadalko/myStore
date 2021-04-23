import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { Observable} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Product} from '../product';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {LoginService} from '../services/login.service';
import localizeExtractLoader from '@angular-devkit/build-angular/src/extract-i18n/ivy-extract-loader';
import {retry} from 'rxjs/operators';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnChanges {
  products: Observable<Product[]>;
  @ViewChild('minPrice') min;
  @ViewChild('maxPrice') max;
  productsForSearch = [];
  productsName: string;
  types = [];
  vendors = [];
  form = this.fb.group({
    type: ['', [Validators.required]],
    vendor: ['', [Validators.required]],
    minPrice: ['', [Validators.required]],
    maxPrice: ['', [Validators.required]]
  })
  logged: string = localStorage.getItem('user');

  constructor(private productService: ProductService, private fb: FormBuilder, public loginService: LoginService) { }

  ngOnInit(): void {
    this.productService.getProducts('type', 'all').subscribe(products=>{
      products.forEach(product => {
        this.productsForSearch.push(product);
        if(!this.types.includes(product.type)) this.types.push(product.type)
        if(!this.vendors.includes(product.vendor)) this.vendors.push(product.vendor)
      })
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.logged) document.getElementById('logOut').style.display = 'none'
  }

  openNav(): void{
    document.getElementById("mySidenav").style.width == "0px"?
      document.getElementById("mySidenav").style.width = "250px":
        document.getElementById("mySidenav").style.width = "0px";
  }

  changeType(type: string) {
    if(this.form.get('type').value) {
      document.getElementById(this.form.get('type').value).style.border = 'none'
      document.getElementById(this.form.get('type').value).style.opacity = '0.3'
      this.form.get('type').setValue(type)
      document.getElementById(this.form.get('type').value).style.border = '2px solid #f73859'
      document.getElementById(this.form.get('type').value).style.opacity = '1'
    } else {
      this.form.get('type').setValue(type)
      document.getElementById(this.form.get('type').value).style.border = '2px solid #f73859'
      document.getElementById(this.form.get('type').value).style.opacity = '1'
    }
  }

  changeVendor(vendor: string) {
    if(this.form.get('vendor').value) {
      document.getElementById(this.form.get('vendor').value).style.border = 'none'
      document.getElementById(this.form.get('vendor').value).style.opacity = '0.3'
      this.form.get('vendor').setValue(vendor)
      document.getElementById(this.form.get('vendor').value).style.border = '2px solid #f73859'
      document.getElementById(this.form.get('vendor').value).style.opacity = '1'
    } else {
      this.form.get('vendor').setValue(vendor)
      document.getElementById(this.form.get('vendor').value).style.border = '2px solid #f73859'
      document.getElementById(this.form.get('vendor').value).style.opacity = '1'
    }
  }

  clearForm() {
    if(document.getElementById(this.form.get('type').value)) {
      document.getElementById(this.form.get('type').value).style.border = 'none'
      document.getElementById(this.form.get('type').value).style.opacity = '0.3'
    }
    if(document.getElementById(this.form.get('vendor').value)){
      document.getElementById(this.form.get('vendor').value).style.border = 'none'
      document.getElementById(this.form.get('vendor').value).style.opacity = '0.3'
    }
    this.form.reset()
  }

  validateMax(value: string) {
    if(value < this.min.nativeElement.value)
      this.max.nativeElement.value = this.min.nativeElement.value
  }

  logOut() {
    document.getElementById('logOut').style.display = 'none'
    this.loginService.logOut()
  }

  isLogged(): boolean {
    return Boolean(localStorage.getItem('user'))
  }
}
