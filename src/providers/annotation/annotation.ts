import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { ApiProvider } from './../api/api';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the AnnotationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnnotationProvider {


  geoopitons: GeolocationOptions = {
    enableHighAccuracy: false,
    maximumAge: 300000,  // 5 minutes
    timeout: 5000        // must be defined to recive timeout
  }

  constructor(private geolocation: Geolocation, private api: ApiProvider, private toastCtrl: ToastController) {

  }

  postAnnotation(challengeId: string, answer: string){
    return new Promise((resolve,reject) => {
      this.geolocation.getCurrentPosition(this.geoopitons)
      .then((val) => {
        let result = this.getAnnotation(challengeId, answer, val.coords.longitude, val.coords.latitude)
        this.api.ApiPost('/annotations', result)
        .then(resolve)
        .catch(reject);
      })
      .catch((val) => {
        this.showLocationToast();
        let result = this.getAnnotation(challengeId, answer)
        this.api.ApiPost('/annotations', result)
        .then(resolve)
        .catch(reject);
      });
    });   
  }

  getAnnotation(challengeId:string, answer:string, longitude?: number, latitude?: number){
    let result: Annotation = {
      challengeID: challengeId,
      answer: answer,
      latitude: latitude ? latitude : 0,
      longitude: longitude ? longitude : 0,
      localTime: new Date().toISOString()
    }
    console.log(JSON.stringify(result));
    return result;
  }

  showLocationToast(){
    let toast = this.toastCtrl.create({
      message: 'Please activate Location. Annotation made without it.',
      duration: 3000,
      dismissOnPageChange: true,
      position: 'top'
    });
    toast.present();
  }
}