import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Cart} from '../models/cart';
import {Purchase} from '../models/purchase.model';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {User} from '../models/user';
import {ProductService} from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  previousBill;
  cartId;
  cartsRef;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private productService: ProductService
  ) {
    this.cartId = this.db.createId();
    if (localStorage.getItem('cartKey') == null) localStorage.setItem('cartKey', this.cartId);
    this.cartsRef = this.db.collection("carts").doc(localStorage.getItem('cartKey'));
  }

  addToCart(product) {
    let cart: Cart;
    this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get().toPromise().then(doc => {
      if (doc.data() && doc.data().bill != 0) {
        cart = doc.data();
        cart.items.forEach(item => {
          if (item.model == product.model) this.increaseQuantity(item.model);
          else {
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
        let flags = [], unique = [];
        for (let i = 0; i < cart.items.length; i++) {
          if (flags[cart.items[i].model]) continue;
          flags[cart.items[i].model] = true;
          unique.push(cart.items[i]);
        }
        cart.items.splice(0, cart.items.length)
        unique.forEach(item => {
          cart.items.push(item)
        })
        this.cartsRef.set((cart), {merge: true})
      })
    this.productService.popup('addedToCart')
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
          if (item.model == model) {
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
      .then(cart => {
        cart.items.forEach(item => {
          if (item.model == model) {
            item.quantity++;
            cart.bill += item.price;
          }
        })
        return cart
      })
      .then(cart => {
        this.cartsRef.set((cart), {merge: true});
      })
  }

  removeItem(model: string) {
    let cart: Cart;
    this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get().toPromise().then((doc) => {
      cart = doc.data();
      return cart
    })
      .then(cart => {
        let newCart = [];
        cart.items.forEach(item => {
          if (item.model != model) newCart.push(item)
        })
        cart.items.splice(0, cart.items.length)
        cart.bill = 0
        newCart.forEach(item => {
          cart.items.push(item)
          cart.bill += item.price * item.quantity
        })
        this.cartsRef.set((cart), {merge: true})
      })
  }

  completePurchase(email: string,
                   addressCity: string,
                   addressStreet: string,
                   addressHouse: string,
                   addressFlat: string,
                   cardNumber: string,
                   cardMonth: string,
                   cardYear: string,
                   cardCvv: string,
                   bill: string,
                   uid: string) {
    let purchase: Purchase;
    this.db.collection<Cart>('carts').doc(localStorage.getItem('cartKey')).get()
      .toPromise()
      .then(data=>{
        purchase = {
          card: {
            cardNumber: cardNumber,
            cardMonth: cardMonth,
            cardYear: cardYear,
            cardCvv: cardCvv,
          },
          cart: {
            bill: data.data().bill,
            items: data.data().items
          },
          customer: email,
          date: Timestamp.now(),
          delivery: {
            addressCity: addressCity,
            addressStreet: addressStreet,
            addressHouse: parseInt(addressHouse),
            addressFlat: parseInt(addressFlat),
          },
          uid: uid
        }
        return data.data().items
      })
      .then(items=>{
        this.db.collection<Purchase>('purchases').doc(this.db.createId()).set({
          card: {
            cardNumber: cardNumber,
            cardMonth: cardMonth,
            cardYear: cardYear,
            cardCvv: cardCvv,
          },
          cart: {
            bill: parseInt(bill),
            items: items
          },
          customer: email,
          date: Timestamp.now(),
          delivery: {
            addressCity: addressCity,
            addressStreet: addressStreet,
            addressHouse: parseInt(addressHouse),
            addressFlat: parseInt(addressFlat),
          },
          uid: uid
        })
          .then(()=>{
            this.db.collection<User>('users').doc(uid).get().toPromise().then(data=>{
              return data.get('purchases')
            })
              .then(purchases=>{
                if(purchases[0].cart.bill == 0) {
                  this.db.collection<User>('users').doc(uid).update({
                    purchases: [purchase]
                  })
                }else{
                  let newPurchases: [Purchase] = purchases;
                  newPurchases.push(purchase)
                  this.db.collection<User>('users').doc(uid).update({
                    purchases: newPurchases
                  })
                }
              })
          })
      })
    this.clearCart()
  }
}

