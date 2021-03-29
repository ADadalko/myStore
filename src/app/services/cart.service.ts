import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';
import {Product} from '../product';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = [];
  cartId;
  cartsRef;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) {
    this.cartId = this.db.createId();
    if(localStorage.getItem('cartKey') == null) localStorage.setItem('cartKey', this.cartId);
    this.cartsRef = this.db.collection("carts").doc(localStorage.getItem('cartKey'));
  }

  addToCart(product){
    this.items.push(product);
    this.cartsRef.set(Object.assign({}, this.items), { merge: true });
  }

  getItems(){
    this.items = [];
    this.db.collection("carts").doc(localStorage.getItem('cartKey'))
      .valueChanges()
      .subscribe(item=>{
        for(let i of Object.entries(item)){
          this.items.push(i[1])
        }
        console.log(this.items[0].price)
      });
    return this.items;
  }

  clearCart(){
    this.items = [];
    this.cartsRef.delete();
    return this.items;
  }

  getShippingPrices() {
    return this.http.get('/assets/shipping.json');
  }
}

