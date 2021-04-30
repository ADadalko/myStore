import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Product} from '../models/product';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {Comparison} from '../models/comparison';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  type: string;
  previousData = [];

  constructor(private db: AngularFirestore) {
  }

  getProducts(key, value): Observable<Product[]> {
    if (value == 'all') {
      return this.db.collection<Product>('products').valueChanges();
    } else {
      return this.db.collection<Product>('products', ref => ref.where(`${key}`, '==', value))
        .valueChanges()
        .pipe(
          map(products => {
            return products;
          })
        );
    }
  }

  getProductsByFilters(type: string, vendor: string, minPrice: string, maxPrice: string): Observable<Product[]> {
    return this.db.collection<Product>('products', ref =>
      ref.where('type', '==', type)
        .where('vendor', '==', vendor)
        .where('price', '>=', parseInt(minPrice))
        .where('price', '<=', parseInt(maxPrice)))
      .valueChanges()
      .pipe(
        map(products => {
          return products;
        })
      );
  }

  getProductById(id: number): Observable<Product[]> {
    return this.db.collection<Product>('products', ref => ref.where('id', '==', id)).valueChanges();
  }

  addReview(user: string, review: string, rating: number, date: Timestamp, productId: number): void {
    const product = {
      user: user,
      review: review,
      rating: rating,
      date: date,
    };
    this.previousData = [];
    this.previousData.push(product);
    this.db.collection<Product>('products').doc(`${productId}`).get().toPromise().then(doc => {
      for (let review of doc.data().reviews) {
        this.previousData.push(review);
      }
      return this.previousData;
    }).then(data => {
      this.db.collection('products').doc(`${productId}`).set({
        reviews: data
      }, {merge: true});
    });
  }

  addToComparison(product) {
    this.previousData = [];
    this.db.collection<Comparison>('comparison').doc(localStorage.getItem('cartKey')).get().toPromise().then(doc => {
      if (doc.data()) {
        for (let item of doc.data().items) {
          this.previousData.push(item)
        }
        let success: boolean = false
        let sameProduct: number = 0
        let differentCategory: number = 0
        this.previousData.forEach(prev=>{
          if(prev.model == product.model){
            sameProduct++;
          }else if(prev.type != product.type){
            differentCategory++
          }else{
            success = true
          }
        })
        console.log(differentCategory);
        if(success && sameProduct == 0 && differentCategory == 0) {
          this.popup('popupComparison')
          this.previousData.push({
            vendor: product.vendor,
            chars: product.chars,
            type: product.type,
            country: product.country,
            description: product.description,
            img: product.img,
            model: product.model,
            price: product.price,
          });
        }
        else if(sameProduct != 0) this.popup('popupComparison', "Product Has Been Already Added To Comparison")
        else if(differentCategory != 0) this.popup('popupComparison', "You Can't Add Products From Different Categories")
        differentCategory = 0
      }else {
        this.previousData.push({
          vendor: product.vendor,
          chars: product.chars,
          type: product.type,
          country: product.country,
          description: product.description,
          img: product.img,
          model: product.model,
          price: product.price,
        });
        this.popup('popupComparison')
      }
      return this.previousData;
    }).then(data => {
      this.db.collection('comparison').doc(localStorage.getItem('cartKey')).set({
        items: data
      }, {merge: true});
    });
  }

  getComparison(): Observable<Comparison> {
    return this.db.collection<Comparison>('comparison').doc(localStorage.getItem('cartKey')).valueChanges();
  }

  clearComparison() {
    this.db.collection<Comparison>('comparison').doc(localStorage.getItem('cartKey')).delete();
  }

  popup(id: string, message?: string){
    document.getElementById(`${id}`).style.display = 'block';
    document.getElementById(`${id}`).style.visibility = 'visible';
    if(message) document.getElementById(`${id}`).innerHTML = `${message}`
    setTimeout(() => {
      document.getElementById(`${id}`).style.visibility = 'hidden';
      document.getElementById(`${id}`).style.display = 'none';
    }, 1000);
  }

}
