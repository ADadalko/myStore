import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Cart} from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  previousBill;
  cartId;
  cartsRef;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) {
    this.cartId = this.db.createId();
    if (localStorage.getItem('cartKey') == null) localStorage.setItem('cartKey', this.cartId);
    this.cartsRef = this.db.collection("carts").doc(localStorage.getItem('cartKey'));
  }

  addToCart(product) {
    let cart: Cart;
    this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get().toPromise().then(doc => {
      if (doc.data() && doc.data().bill!=0) {
        cart = doc.data();
        cart.items.forEach(item=>{
          if(item.model == product.model) this.increaseQuantity(item.model);
          else{
            cart.items.push({
              model: product.model,
              price: product.price,
              img: product.img,
              description: product.description,
              quantity: 1
            })
            cart.bill += product.price
          }
        })
      } else {
        cart = {
          bill: product.price,
          items: [{
            model: product.model,
            price: product.price,
            img: product.img,
            description: product.description,
            quantity: 1
          }]
        }
      }
      return cart
    })
      .then(cart => {
        console.log(cart.items)
        let flags = [], unique = [];
        for(let i = 0; i < cart.items.length; i++) {
          if( flags[cart.items[i].model]) continue;
          flags[cart.items[i].model] = true;
          unique.push(cart.items[i]);
        }
        cart.items.splice(0, cart.items.length)
        unique.forEach(item=>{
          cart.items.push(item)
        })
        this.cartsRef.set((cart), {merge: true})
      })
  }


  getCart(): Observable<Cart> {
    return this.db.collection('carts')
      .doc<Cart>(localStorage.getItem('cartKey'))
      .valueChanges();
  }

  clearCart() {
    this.cartsRef.delete();
  }

  decreaseQuantity(model: string) {
    let cart: Cart;
    this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get().toPromise().then((doc) => {
      cart = doc.data();
      return cart
    })
      .then(cart => {
        cart.items.forEach(item => {
          if(item.model == model){
            item.quantity--;
            cart.bill -= item.price;
          }
        })
        return cart
      })
      .then(cart => {
        this.cartsRef.set((cart), {merge: true});
      })
  }

  increaseQuantity(model: string) {
    let cart: Cart;
      this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get().toPromise().then((doc) => {
        cart = doc.data();
        return cart
      })
        .then(cart=>{
          cart.items.forEach(item=>{
            if(item.model == model){
              item.quantity++;
              cart.bill += item.price;
            }
          })
          return cart
        })
        .then(cart=>{
        this.cartsRef.set((cart), { merge: true });
      })
    }

  removeItem(model: string) {
    let cart: Cart;

    this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get().toPromise().then((doc) => {
      cart = doc.data();
      return cart
    })
      .then(cart=>{
        let newCart = [];
        cart.items.forEach(item=>{
          if(item.model != model) newCart.push(item)
        })
        cart.items.splice(0, cart.items.length)
        cart.bill = 0
        newCart.forEach(item=>{
          cart.items.push(item)
          cart.bill += item.price
        })
        this.cartsRef.set((cart), {merge: true})
      })
  }
}
