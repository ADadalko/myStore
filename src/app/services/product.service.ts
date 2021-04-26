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

  constructor(private db: AngularFirestore) {}

  getProducts(key, value):Observable<Product[]> {
    if(value == 'all'){
      return this.db.collection<Product>('products').valueChanges();
    }else{
    return this.db.collection<Product>('products', ref => ref.where(`${key}`, '==', value))
      .valueChanges()
      .pipe(
        map(products => {
          return products;
        })
      );
    }
  }

  getProductsByFilters(type: string, vendor: string, minPrice: string, maxPrice: string):Observable<Product[]> {
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

  getProductById(id: number): Observable<Product[]>{
    return this.db.collection<Product>('products', ref => ref.where('id', '==', id)).valueChanges()
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
    this.db.collection<Product>('products').doc(`${productId}`).get().toPromise().then(doc=>{
      for(let review of doc.data().reviews){
        this.previousData.push(review)
      }
      return this.previousData
    }).then(data=>{
      this.db.collection("products").doc(`${productId}`).set({
        reviews: data
      }, {merge: true})
    })
  }

  addToComparison(product){
    this.previousData = [];
    this.previousData.push({
      vendor: product.vendor,
      chars: product.chars,
      country: product.country,
      description: product.description,
      img: product.img,
      model: product.model,
      price: product.price,
    })
    this.db.collection<Comparison>('comparison').doc(localStorage.getItem('cartKey')).get().toPromise().then(doc=>{
      if(doc.data()){
      for(let item of doc.data().items){
        this.previousData.push(item)
      }}
      return this.previousData
    }).then(data=>{
      this.db.collection('comparison').doc(localStorage.getItem('cartKey')).set({
        items: data
      }, {merge: true})
    })
  }

  getComparison(): Observable<Comparison>{
   return this.db.collection<Comparison>('comparison').doc(localStorage.getItem('cartKey')).valueChanges()
  }

  clearComparison(){
    this.db.collection<Comparison>('comparison').doc(localStorage.getItem('cartKey')).delete();
  }

}
