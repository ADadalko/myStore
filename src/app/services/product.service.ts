import {Injectable} from '@angular/core';
import {async, Observable, of} from 'rxjs';
import {Product} from '../models/product';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, max} from 'rxjs/operators';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {LocalstorageService} from './localstorage.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  type: string;
  previousData = [];

  constructor(private db: AngularFirestore,
              private localSt: LocalstorageService,) {
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

  getProductsByFilters(type, vendors, minPrice, maxPrice): Observable<Product[]> {
    if(type && vendors.length && minPrice != 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('vendor', 'in', vendors)
          .where('price', '>=', parseInt(minPrice))
          .where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    if(!type && vendors.length && minPrice != 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('vendor', 'in', vendors)
          .where('price', '>=', parseInt(minPrice))
          .where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    if(type && !vendors.length && minPrice != 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('price', '>=', parseInt(minPrice))
          .where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    if(type && vendors.length && minPrice == 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('vendor', 'in', vendors)
          .where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    if(type && vendors.length && minPrice != 0 && maxPrice == 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('vendor', 'in', vendors)
          .where('price', '>=', parseInt(minPrice))).valueChanges()
    }
    if(type && !vendors.length && minPrice == 0 && maxPrice == 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)).valueChanges()
    }
    if(!type && vendors.length && minPrice == 0 && maxPrice == 0) {
      console.log(vendors)
      return this.db.collection<Product>('products', ref =>
        ref.where('vendor', 'in', vendors)).valueChanges()
    }
    if(!type && !vendors.length && minPrice != 0 && maxPrice == 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('price', '>=', parseInt(minPrice))).valueChanges()
    }
    if(!type && !vendors.length && minPrice == 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    if(!type && !vendors.length && minPrice != 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('price', '<=', parseInt(maxPrice))
          .where('price', '>=', parseInt(minPrice))).valueChanges()
    }
    if(type && vendors.length && minPrice == 0 && maxPrice == 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('vendor', 'in', vendors)).valueChanges()
    }
    if(type && !vendors.length && minPrice == 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    if(!type && vendors.length && minPrice != 0 && maxPrice == 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('vendor', 'in', vendors)
          .where('price', '>=', parseInt(minPrice))).valueChanges()
    }
    if(type && !vendors.length && minPrice != 0 && maxPrice == 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('type', '==', type)
          .where('price', '>=', parseInt(minPrice))).valueChanges()
    }
    if(!type && vendors.length && minPrice == 0 && maxPrice != 0) {
      return this.db.collection<Product>('products', ref =>
        ref.where('vendor', 'in', vendors)
          .where('price', '<=', parseInt(maxPrice))).valueChanges()
    }
    return this.db.collection<Product>('products').valueChanges()
  }

  getProductById(id: number): Observable<Product[]> {
    return this.db.collection<Product>('products', ref => ref.where('id', '==', id)).valueChanges();
  }

  getSearchProducts(q: string, models): Observable<Product[]> {
    let arr = []
    if(typeof models != 'string'){
      arr = models.filter(val => val.toLowerCase().indexOf(q.toLowerCase()) >= 0)
      if(arr.length != 0) return this.db.collection<Product>('products', ref => ref.where('model', 'in', arr.slice(0, 9))).valueChanges()
      else return this.db.collection<Product>('products', ref => ref.where('model', 'in', [100])).valueChanges()
    }
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
      if (doc.data().reviews) {
        for (let review of doc.data()?.reviews) {
          this.previousData.push(review);
        }
      }
      return this.previousData;
    }).then(data => {
      this.db.collection('products').doc(`${productId}`).set({
        reviews: data
      }, {merge: true});
    });
  }

  addToComparison(product) {
    if(!this.localSt.get('comparison')){
      this.localSt.set('comparison', {
        category: product.type,
        id: [product.id]
      })
      this.popup('popupComparison', '✅ <br> Added To Comparison');
    }else{
      let newArr = [];
      let newCat: string = '';
      let comparison = this.localSt.get('comparison')
      comparison.id.forEach(item=>{
        newArr.push(item)
      })
      newCat = comparison.category
      if(!newArr.includes(product.id) && comparison.category == product.type) {
        newArr.push(product.id)
        newCat = product.type
        this.popup('popupComparison', '✅ <br> Добавлено в сравнение');
      }else if(newArr.includes(product.id)){
        this.popup('popupComparison', 'Продукт уже в сравнении');
      }else if(comparison.category != product.type){
        this.popup('popupComparison', 'Вы не можете добавлять в сравнение продукты из разных категорий');
      }
      this.localSt.set('comparison', {
        category: newCat,
        id: newArr
      })
    }
    document.getElementById('comparisonDiv').style.display = 'block'
  }

  getComparison(): Observable<Product[]> {
    if(this.localSt.get('comparison')) {
      let arr = this.localSt.get('comparison')?.id;
      return this.db.collection<Product>('products', ref => ref.where('id', 'in', arr)).valueChanges()
    }
  }

  clearComparison() {
    this.localSt.set('comparison', {
      category: '',
      id: [0]
    })
    document.getElementById('comparisonDiv').style.display = 'none'
    this.localSt.remove('comparison')
  }

  popup(id: string, message?: string) {
    document.getElementById(`${id}`).style.display = 'block';
    document.getElementById(`${id}`).style.visibility = 'visible';
    if (message) {
      document.getElementById(`${id}`).innerHTML = `${message}`;
    }
    setTimeout(() => {
      document.getElementById(`${id}`).style.visibility = 'hidden';
      document.getElementById(`${id}`).style.display = 'none';
    }, 1000);
  }

  deleteComparisonItem(id: number) {
    let prevData;
    prevData = this.localSt.get('comparison')
    let index = prevData.id.indexOf(id)
    prevData.id.splice(index, 1)
    this.localSt.set('comparison', prevData)
  }

}
