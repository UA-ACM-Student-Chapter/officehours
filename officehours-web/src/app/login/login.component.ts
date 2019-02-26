import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) {
  }
  public login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  public logout() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() {

  }

}
