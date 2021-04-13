import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn = false
  constructor(public firebaseAuth: AngularFireAuth) { }

  async signInWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider()
    await firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(result.user))
      })
  }

  async signIn(email: string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(res=>{
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user))
      }).catch((error)=>{
        alert(error)
      })
  }

  async signUp(email: string, password: string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(res=>{
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user))
      })
  }
  logOut(){
    this.firebaseAuth.signOut()
    localStorage.removeItem('user')
  }
}
