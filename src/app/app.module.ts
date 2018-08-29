//----------------------Base--------------------------------

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//----------------------Pages--------------------------------
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { RewardsPage } from './../pages/rewards/rewards';
import { DiscoverPage } from './../pages/discover/discover';

//----------------------Components--------------------------------
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//----------------------Extensions--------------------------------

import { SwingModule } from 'angular2-swing';
import { AuthProvider } from '../providers/auth/auth';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationProvider } from '../providers/annotation/annotation';
import { Geolocation } from '@ionic-native/geolocation';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    DiscoverPage,
    RewardsPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SwingModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgCircleProgressModule.forRoot({
      radius : 80,
      space : -13,
      toFixed : 0,
      maxPercent : 1000,
      unitsFontSize : "18",
      outerStrokeWidth : 10,
      outerStrokeColor : "#922cdf",
      innerStrokeColor : "#f4f4ef",
      innerStrokeWidth : 16,
      titleFontSize : "26",
      titleColor : "#1f2b58",
      subtitleColor : "#82669b",
      animationDuration : 800,
      showBackground : false,
      responsive : true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    DiscoverPage,
    RewardsPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiProvider,
    AnnotationProvider
  ]
})
export class AppModule {}
