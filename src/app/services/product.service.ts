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
  notesCollection: AngularFirestoreCollection<Product>;
  notes: Observable<Product[]>

  constructor(private db: AngularFirestore) {}

  getProducts(type):Observable<Product[]> {

    const collection = this.db.collection<Product>('products', ref => ref.where('type', '==', type))
    return collection
      .valueChanges()
      .pipe(
        map(products => {
          return products;
        })
      );

    // this.notesCollection = this.db.collection('products');
    // this.notes = this.notesCollection.valueChanges();

     // this.db.collection("products").ref.where("id", "==", 1)
     //  .get()
     //  .then((querySnapshot) => {
     //    querySnapshot.forEach((doc) => {
     //      // doc.data() is never undefined for query doc snapshots
     //      console.log(doc.get('model'));
     //    });
     //  })
     //  .catch((error) => {
     //    console.log("Error getting documents: ", error);
     //  });

    // return this.notes;
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

