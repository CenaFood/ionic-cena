import { TabsPage } from './../tabs/tabs';
import { AuthProvider } from './../../providers/auth/auth';
import {Component} from "@angular/core";
import 'rxjs/add/operator/map';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  // When the page loads, we want the Login segment to be selected
  authType: string = "login";


  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
    this.auth.logout();
  }

  authenticate(credentials) {
    this.authType == 'login' ? this.auth.login(credentials, () => this.dismiss()) : this.auth.signup(credentials, () => this.dismiss());
  }

  dismiss(){
    this.navCtrl.setRoot(TabsPage);
  }
}
