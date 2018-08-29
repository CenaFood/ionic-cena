import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  expected: number = 800 
  percentPersonal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
    this.updatePercent();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardsPage');
  }

  ionViewDidEnter(){
   this.updatePercent();
  }


  updatePercent(){
    this.api.ApiGet('/stats').then((stats: Array<any>) => {
      let cenaStats = this.getCenaEntry(stats);
      this.percentPersonal = Math.round(100*cenaStats.personalLabelsCount/this.expected);
    })
  }

  getCenaEntry(statistics: Array<any>){
    let result = statistics.filter(entry => entry.projectName == "cena")[0];
    console.log(result);
    return result;
  }


  formatSubtitle = (percent: number) : string => {
    if(percent >= 100){
      return "Awesome, Thank you!"
    }else if(percent >= 75){
      return "Allmost there"
    }else if(percent > 0){
      return "Keep going!"
    }else {
      return "Just start swiping."
    }
  }
}
