import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface Review {
  review: string,
  rating: string,
  user: string,
  date: Timestamp
}
