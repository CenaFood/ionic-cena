import { TutorialPage } from './../tutorial/tutorial';
import { NavController } from 'ionic-angular';
import { WelcomePage } from './../welcome/welcome';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { RewardsPage } from './../rewards/rewards';
import { DiscoverPage } from './../discover/discover';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DiscoverPage;
  tab2Root = TutorialPage;
  tab3Root = AboutPage;

  constructor(private navCtrl: NavController, private auth:AuthProvider) {
    this.auth.ready().then(()=>{
      if(!this.auth.authenticated()){
        this.navCtrl.setRoot('TutorialPage');
      }
    })
  }
}
