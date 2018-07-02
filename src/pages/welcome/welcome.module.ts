import { AuthProvider } from './../../providers/auth/auth';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';

@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    AuthProvider,
    IonicPageModule.forChild(WelcomePage),
  ],
})
export class WelcomePageModule {}
