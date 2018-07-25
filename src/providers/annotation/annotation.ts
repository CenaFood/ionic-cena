import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { ApiProvider } from './../api/api';
import { Injectable } from '@angular/core';

/*
  Generated class for the AnnotationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnnotationProvider {


  geoopitons: GeolocationOptions = {
    enableHighAccuracy: false,
    maximumAge: 300000  // 5 minutes
  }

  constructor(private geolocation: Geolocation, private api: ApiProvider, ) {

  }

  postAnnotation(challengeId: string, answer: string){
    return new Promise((resolve,reject) => {
      this.geolocation.getCurrentPosition(this.geoopitons)
      .then((val) => {
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
      });
    });   
  }
}