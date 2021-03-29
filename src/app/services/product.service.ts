import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../product';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  type: string;

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

