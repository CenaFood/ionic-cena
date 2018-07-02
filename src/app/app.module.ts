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
import { AuthProvider } from '../providers/auth/auth';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';

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
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    DiscoverPage,
    RewardsPage,
    WelcomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiProvider
  ]
})
export class AppModule {}
