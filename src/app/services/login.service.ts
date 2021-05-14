import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import Timestamp = firebase.firestore.Timestamp;
import {ProductService} from './product.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn = false
  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFirestore, private productService: ProductService) { }

  async signInWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider()
    await firebase.auth()
      .signInWithPopup(provider)
      .then((res) => {
        this.db.collection<User>('users').doc(res.user.uid).get().toPromise()
          .then(data=>{
            if(!data.exists){
              this.db.collection<User>('users').doc(res.user.uid).set({
                purchases: [{
                  customer: '',
                  delivery: {
                    addressCity: '',
                    addressStreet: '',
                    addressFlat: 0,
                    addressHouse: 0
                  },
                  card: {
                    cardNumber: '',
                    cardMonth: '',
                    cardCvv: '',
                    cardYear: ''
                  },
                  date: Timestamp.now(),
                  cart: {
                    items: [{
                      model: '',
                      price: 0,
                      img: '',
                      description: '',
                      quantity: 0
                    }],
                    bill: 0
                  },
                  uid: '',
                }],
                uid: res.user.uid,
                address: {
                  addressCity: '',
                  addressFlat: 0,
                  addressHouse: 0,
                  addressStreet: ''
                },
                auth: 'google',
                card: {
                  cardCvv: '',
                  cardMonth: '',
                  cardNumber: '',
                  cardYear: ''
                },
                email: res.user.email,
                id: this.db.createId(),
                password: '',
                personalInfo: {
                  birthday: '',
                  firstName: '',
                  secondName: ''
                },
                username: res.user.displayName
              })
            }
          })
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user.uid))
      })
  }

  async signIn(email: string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(res=>{
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user.uid))
      }).catch((error)=>{
        this.isLoggedIn = false
      })
  }

  async signUp(email: string, password: string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(res=>{
        this.db.collection<User>('users').doc(res.user.uid).get().toPromise()
          .then(data=>{
            if(!data.exists){
              this.db.collection<User>('users').doc(res.user.uid).set({
                purchases: [{
                  customer: '',
                  delivery: {
                    addressCity: '',
                    addressStreet: '',
                    addressFlat: 0,
                    addressHouse: 0
                  },
                  card: {
                    cardNumber: '',
                    cardMonth: '',
                    cardCvv: '',
                    cardYear: ''
                  },
                  date: Timestamp.now(),
                  cart: {
                    items: [{
                      model: '',
                      price: 0,
                      img: '',
                      description: '',
                      quantity: 0
                    }],
                    bill: 0
                  },
                  uid: '',
                }],
                uid: res.user.uid,
                address: {
                  addressCity: '',
                  addressFlat: 0,
                  addressHouse: 0,
                  addressStreet: ''
                },
                auth: 'ordinary',
                card: {
                  cardCvv: '',
                  cardMonth: '',
                  cardNumber: '',
                  cardYear: ''
                },
                email: res.user.email,
                id: this.db.createId(),
                password: password,
                personalInfo: {
                  birthday: '',
                  firstName: '',
                  secondName: ''
                },
                username: ''
              })
            }
          })
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user.uid))
      }).catch(error=>{
        this.productService.popup('popupLogin', error)
      })
  }
  logOut(){
    this.firebaseAuth.signOut()
    localStorage.removeItem('user')
  }

  async updateInfo(email: string, password: string) {
    await firebase.auth().currentUser.updateEmail(email);
    await firebase.auth().currentUser.updatePassword(password);
    await this.db.collection<User>('users').doc(firebase.auth().currentUser.uid).update({
      email: email,
      password: password
    }).catch(error=>{
      this.productService.popup('popupInvalidConfirm', error)
    })
  }

  getUser(): Observable<User>{
    return this.db.collection<User>('users', ref => ref.orderBy('purchases', 'desc')).doc(JSON.parse(localStorage.getItem('user')))
      .valueChanges()
  }

  addDeliveryInfo(uid: string, city: string, street: string, house: number, flat: number) {
    this.db.collection<User>('users').doc(uid).update({
      address: {
        addressCity: city,
        addressStreet: street,
        addressHouse: house,
        addressFlat: flat
      }
    })
  }

  addCardInfo(uid: string, number: string, month: string, year: string, cvv: string) {
    this.db.collection<User>('users').doc(uid).update({
      card: {
        cardNumber: number,
        cardMonth: month,
        cardYear: year,
        cardCvv: cvv,
      }
    })
  }

  addPersonalInfo(uid: string, firstName: string, secondName: string, birthDay: string) {
    this.db.collection<User>('users').doc(uid).update({
      personalInfo: {
        firstName: firstName,
        secondName: secondName,
        birthday: birthDay,
      }
    })
  }
}
