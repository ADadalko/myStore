import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Product} from '../product';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  type: string;
  previousData = [];
  products = [];

  constructor(private db: AngularFirestore) {}

  getProducts(key, value):Observable<Product[]> {
    if(value == 'all'){
      return this.db.collection<Product>('products').valueChanges();
    }else{
    const collection = this.db.collection<Product>('products', ref => ref.where(`${key}`, '==', value))
    return collection
      .valueChanges()
      .pipe(
        map(products => {
          return products;
        })
      );
    }
  }

  getProductById(id: number): Observable<Product[]>{
    const collection = this.db.collection<Product>('products', ref => ref.where('id', '==', id))
    return collection
      .valueChanges()
  }

  addReview(user: string, review: string, rating: number, date: Timestamp, productId: number): void{
    const product = {
      user: user,
      review: review,
      rating: rating,
      date: date,
    }
    this.previousData = [];
    this.previousData.push(product)
    this.db.collection<Product>('products').doc(`${productId}`).get().subscribe(t=>{
      for(let review of t.get('reviews')){
        this.previousData.push(review)
      }
    });
    setTimeout(()=>this.db.collection("products").doc(`${productId}`).set({
      reviews: this.previousData
    }, {merge: true}), 1000);
  }

}
