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

  expected: number = 80000;
  percentPersonal: number = 0;
  quote: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
    this.updatePercent();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardsPage');
  }

  ionViewDidEnter() {
    this.updatePercent();
  }


  updatePercent() {
    this.api.ApiGet('/stats').then((stats: Array<any>) => {
      let cenaStats = this.getCenaEntry(stats);
      this.percentPersonal = Math.round(100 * cenaStats.personalLabelsCount / this.expected);
      this.quote = this.getQuote(this.percentPersonal);
    })
  }

  getCenaEntry(statistics: Array<any>) {
    let result = statistics.filter(entry => entry.projectName == "cena")[0];
    console.log(result);
    return result;
  }


  formatSubtitle = (percent: number): string => {
    if (percent >= 150) {
      return "Masterlabler"
    } else if (percent >= 100) {
      return "Puh, Got it!"
    } else if (percent >= 75) {
      return "Allmost there"
    } else if (percent > 0) {
      return "Keep going!"
    } else {
      return "Just start swiping."
    }
  }

  getQuote(percent: number): string {
    if (percent >= 150) {
      return "You are an Official Masterlabler"
    } else if (percent >= 100) {
      return "Puh, Got it!"
    } else if (percent >= 80) {
      return "Awesome, Thank you!"
    } else if (percent >= 70) {
      return "Does your thumb hurt already?"
    } else if (percent >= 53) {
      return "Believe you can and you’re halfway there."
    } else if (percent >= 50) {
      return "Half of it? Really only half of it?"
    } else if (percent >= 20) {
      return "Never, never, never give up."
    } else if (percent >= 13) {
      return "You're not getting tired? Are you?"
    } else if (percent >= 5) {
      return "Turn your wounds into wisdom."
    } else if (percent > 0) {
      return "Don’t wait. The time will never be just right."
    } else {
      return ""
    }
  }
}
