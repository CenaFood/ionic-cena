import { Geolocation } from '@ionic-native/geolocation';
import { ApiProvider } from './../api/api';
import { Injectable } from '@angular/core';

/*
  Generated class for the AnnotationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnnotationProvider {

  cordinates: Coordinates;

  constructor(private geolocation: Geolocation, private api: ApiProvider, ) {
    //subscribe to updates
    geolocation.watchPosition().subscribe(
      (val) => this.cordinates = val.coords);
  }

  ready() {
    return this.geolocation.getCurrentPosition()
      .then(val => this.cordinates = val.coords);
  }

  postAnnotation(challengeId: string, answer: string){
      let result: Annotation = {
        challengeID: challengeId,
        answer: answer,
        latitude: this.cordinates.latitude,
        longitude: this.cordinates.longitude,
        localTime: new Date().toISOString()
      }

    console.log(JSON.stringify(result));
    return this.api.ApiPost('/annotations', result);
  }
}