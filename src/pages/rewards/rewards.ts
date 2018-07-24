import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgProgress } from 'ngx-progressbar';

/**
 * Generated class for the RewardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-rewards',
  templateUrl: 'rewards.html',
})
export class RewardsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ngProgress: NgProgress) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardsPage');
  }

  ngOnInit(){
    this.ngProgress.set(0.2);
  }

}
