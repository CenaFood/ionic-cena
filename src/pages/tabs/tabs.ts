import { RewardsPage } from './../rewards/rewards';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { DiscoverPage } from './../discover/discover';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DiscoverPage;
  tab2Root = RewardsPage;
  tab3Root = AboutPage;

  constructor(private navCtrl: NavController, private auth:AuthProvider) {
    this.auth.ready().then(()=>{
      if(!this.auth.authenticated()){
        this.navCtrl.setRoot('WelcomePage');
      }
    })
  }
}
