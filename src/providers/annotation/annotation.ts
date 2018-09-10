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
    timeout: 1000        // must be defined to 
  }

  constructor(private geolocation: Geolocation, private api: ApiProvider, private toastCtrl: ToastController) {

  }

  postAnnotation(challengeId: string, answer: string){
    return new Promise((resolve,reject) => {
      this.geolocation.getCurrentPosition(this.geoopitons)
      .then((val) => {
        console.log(val);
        let result: Annotation = {
          challengeID: challengeId,
          answer: answer,
          latitude: val.coords.latitude,
          longitude: val.coords.longitude,
          localTime: new Date().toISOString()
        }

        console.log(JSON.stringify(result));
        this.api.ApiPost('/annotations', result)
        .then(resolve)
        .catch(reject);
      })
      .catch((val) => {

        this.showLocationToast();
        let result: Annotation = {
          challengeID: challengeId,
          answer: answer,
          latitude: 0,
          longitude: 0,
          localTime: new Date().toISOString()
        }

        console.log(JSON.stringify(result));
        this.api.ApiPost('/annotations', result)
        .then(resolve)
        .catch(reject);
      });
    });   
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