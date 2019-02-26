import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LoginComponent } from './login/login.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'officehours-web';
  constructor(public snackBar: MatSnackBar, public afAuth: AngularFireAuth) { }

  sayHey: Function = function () {
    this.snackBar.open('Hey!', 'Dismiss', {
      duration: 2000,
    });
  }
  login: Function = function() {
    let loginService = new LoginComponent(this.afAuth);
    loginService.login();
  }

  logout: Function = function() {
    let loginService = new LoginComponent(this.afAuth);
    loginService.logout();
  }
}
