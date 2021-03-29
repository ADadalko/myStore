import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Review {
  date: Timestamp
  mark: number
  review: string
  user: string
}
