import { TabsPage } from './../tabs/tabs';
import { AuthProvider } from './../../providers/auth/auth';
import {Component, ViewChild} from "@angular/core";
import 'rxjs/add/operator/map';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  authType: string = "signup";

  @ViewChild(Slides) slides: Slides;


  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private storage:Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
    this.auth.logout();

    this.storage.get('firstLaunch').then((tutorialShown) => {
      if (tutorialShown) {
        this.slides.slideTo(this.slides.length()-1);  
      }
      this.storage.set('firstLaunch', true);
    })
  }

  authenticate(credentials) {
    this.authType == 'login' ? this.auth.login(credentials, () => this.dismiss()) : this.auth.signup(credentials, () => this.dismiss());
  }

  dismiss(){
    this.navCtrl.setRoot(TabsPage);
  }

  setAuthType(type: string){
    console.log("Type", type);
    this.authType = type;
  }

}
