import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface Product{
  chars: Map<string,string>,
  country: string,
  description: string,
  id: number,
  img: string,
  model: string,
  price: number,
  reviews: [{
    review: string,
    rating: string,
    user: string,
    date: Timestamp
  }],
  type: string,
  vendor: string
}
