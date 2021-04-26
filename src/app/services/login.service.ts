import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn = false
  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFirestore) { }

  async signInWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider()
    await firebase.auth()
      .signInWithPopup(provider)
      .then((res) => {
        this.db.collection<User>('users').doc(res.user.uid).get().toPromise()
          .then(data=>{
            if(!data.exists){
              this.db.collection<User>('users').doc(res.user.uid).set({
                uid: res.user.uid,
                address: {
                  addressCity: '',
                  addressFlat: 0,
                  addressHouse: 0,
                  addressStreet: ''
                },
                auth: 'google',
                card: {
                  cardCvv: 0,
                  cardMonth: 0,
                  cardNumber: 0,
                  cardYear: 0
                },
                email: res.user.email,
                id: this.db.createId(),
                password: '',
                personalInfo: {
                  birthday: 0,
                  firstName: '',
                  secondName: ''
                },
                photo: res.user.photoURL,
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
        alert(error)
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
                uid: res.user.uid,
                address: {
                  addressCity: '',
                  addressFlat: 0,
                  addressHouse: 0,
                  addressStreet: ''
                },
                auth: 'ordinary',
                card: {
                  cardCvv: 0,
                  cardMonth: 0,
                  cardNumber: 0,
                  cardYear: 0
                },
                email: res.user.email,
                id: this.db.createId(),
                password: password,
                personalInfo: {
                  birthday: 0,
                  firstName: '',
                  secondName: ''
                },
                photo: res.user.photoURL,
                username: res.user.displayName
              })
            }
          })
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user.uid))
      }).catch(error=>{
        alert(error)
      })
  }
  logOut(){
    this.firebaseAuth.signOut()
    localStorage.removeItem('user')
  }

  async updateInfo(email:string ,password:string) {
    this.firebaseAuth.currentUser.then(user=>{
      user.updateEmail(email)
      user.updatePassword(password)
    })
  }

  getUser(): Observable<User>{
    return this.db.collection<User>('users').doc(JSON.parse(localStorage.getItem('user')))
      .valueChanges()
  }

  addDeliveryInfo(uid: string, city: string, street: string, house: number, flat: number) {
    this.db.collection<User>('users').doc(uid).get().toPromise()
      .then(user=>{
      })
  }
}
