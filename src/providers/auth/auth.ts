import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelper } from "angular2-jwt";
import { Http, Headers, Response, RequestOptions } from '@angular/http';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  private STORAGE: Storage;
  private HTTP: Http;

  private LOGIN_URL = "https://cenaswiper.luethi.rocks/auth/login/";
  private SIGNUP_URL = "https://cenaswiper.luethi.rocks/auth/register/";

  private contentHeader;
  private jwtHelper = new JwtHelper();

  public user:string;
  public error: string;
  private token: string;

  constructor(public http: Http, public storage: Storage) {
    this.HTTP = http;
    this.STORAGE = storage;

    this.contentHeader = new Headers();
    //this.contentHeader.append('Access-Control-Allow-Origin' , '*');
    //this.contentHeader.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //this.contentHeader.append('Accept','application/json');
    this.contentHeader.append('content-type','application/json');

    console.log('Hello AuthProvider Provider');
  }

  public authenticated(): boolean {
    return tokenNotExpired("Token", this.token);
  }

  public ready(){
    return this.STORAGE.ready;
  }

  public async getProfile(){
    let profile = await this.storage.get('Profile');
    return JSON.parse(profile);
  }

  public login(credentials) {
    console.log(credentials);
    this.HTTP.post(this.LOGIN_URL, JSON.stringify(credentials), {headers: this.contentHeader})
      .map((res:Response) => res.json())
      .subscribe(
        (data: any) => this.authSuccess(data),
        err => {this.error = err; console.log("Error", err);}
      );
  }

  public signup(credentials) {
    this.HTTP.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map((res:Response) => res.text())
      .subscribe(
        (data: String) => this.authSuccess(data),
        err => this.error = err
      );
  }

  public addAuthorizeHeader(headers: Headers){
    headers.append("authorization", `Bearer ${this.token}`);
  }

  public logout() {
    this.storage.remove('token');
    this.token = null;
    this.error = null;
    this.user = null;
  }

  public authSuccess(token) {
    console.log(token);
    this.error = null;
    this.storage.set('token', token);
    this.token = token;
    this.user = this.jwtHelper.decodeToken(token).sub;
    this.storage.set('profile', this.user);
  }


  
}
