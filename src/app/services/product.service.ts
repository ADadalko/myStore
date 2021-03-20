import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../product';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  type: string;

  constructor(private db: AngularFirestore) {}

  getProducts(type):Observable<Product[]> {
    if(type == 'all'){
      return this.db.collection<Product>('products').valueChanges();
    }else{
    const collection = this.db.collection<Product>('products', ref => ref.where('type', '==', type))
    return collection
      .valueChanges()
      .pipe(
        map(products => {
          return products;
        })
      );
    }
  }

  getProductById(id: number): Observable<Product[]> {
    const collection = this.db.collection<Product>('products', ref => ref.where('id', '==', id))
    return collection
      .valueChanges()
      .pipe(
        map(products => {
          return products;
        })
      );
  }
}

