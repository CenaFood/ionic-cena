//----------------------Base--------------------------------

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//----------------------Pages--------------------------------
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from './../pages/tutorial/tutorial';
import { WelcomePage } from './../pages/welcome/welcome';
import { RewardsPage } from './../pages/rewards/rewards';
import { DiscoverPage } from './../pages/discover/discover';

//----------------------Components--------------------------------
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//----------------------Extensions--------------------------------
import { HttpModule } from '@angular/http';
import { SwingModule } from 'angular2-swing';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    DiscoverPage,
    RewardsPage,
    TabsPage,
    WelcomePage,
    TutorialPage    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SwingModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    DiscoverPage,
    RewardsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
