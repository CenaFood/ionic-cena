import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public auth: AuthProvider, private app: App) {

  }

  private logout(){
    this.auth.logout();
    this.app.getRootNav().setRoot('WelcomePage');
  }
}
