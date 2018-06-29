import { WelcomePage } from './../welcome/welcome';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { RewardsPage } from './../rewards/rewards';
import { DiscoverPage } from './../discover/discover';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DiscoverPage;
  tab2Root = RewardsPage;
  tab3Root = WelcomePage;

  constructor() {

  }
}
