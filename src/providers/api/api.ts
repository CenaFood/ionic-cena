import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  contentHeader: HttpHeaders;

  private readonly API_URL = "https://cenaswiper.luethi.rocks/";
  
  constructor(public http: HttpClient, private auth: AuthProvider) {
    this.contentHeader = new HttpHeaders(
      {
        'Content-Type':  'application/json',
      }); 
    console.log('Hello ApiProvider Generated');
  }

  public ApiGet(route: string){
    let headers = this.auth.addAuthorizeHeader(this.contentHeader);
    let getUrl = new URL(route,this.API_URL)
    return this.http.get(
      getUrl.toString(), 
      {headers: headers})
      .toPromise();
  }

  public ApiPost(route: string, payload: object){
    let headers = this.auth.addAuthorizeHeader(this.contentHeader);
    let postUrl = new URL(route,this.API_URL);
    return this.http.post(
      postUrl.toString(), 
      payload,
      {headers: headers})
      .toPromise();
  }
}
