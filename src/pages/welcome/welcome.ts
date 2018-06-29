import { AuthProvider } from './../../providers/auth/auth';
import {Component} from "@angular/core";
import {Http} from "@angular/http";
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
  auth: AuthProvider;

  // When the page loads, we want the Login segment to be selected
  authType: string = "login";


  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage, private authProvider: AuthProvider) {
    this.auth = authProvider;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }


  authenticate(credentials) {
    this.authType == 'login' ? this.auth.login(credentials) : this.auth.signup(credentials);
  }


}
