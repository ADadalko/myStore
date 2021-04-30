import {Address} from './address.model';
import {Card} from './card.model';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {Cart} from './cart';

export interface Purchase {
  customer: string,
  delivery: Address,
  card: Card,
  date: Timestamp,
  cart: Cart,
  uid: string,
}
