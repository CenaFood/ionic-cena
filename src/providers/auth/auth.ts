import { Headers } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpHeaders } from '@angular/Http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {JwtHelper} from "angular2-jwt";
import { Http, Headers, Response } from '@angular/http';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  private STORAGE: Storage;
  private LOGIN_URL = "https://cenaswiper.luethi.rocks/auth/login";
  private SIGNUP_URL = "https://cenaswiper.luethi.rocks/auth/register";

  private contentHeader = new Headers({"Content-Type": "application/json"});
  private jwtHelper = new JwtHelper();
  private http: Http;

  public user:string;
  public error: string;

  constructor(public http: Http, public storage: Storage) {
    this.http = http;
    this.STORAGE = Storage;
    console.log('Hello AuthProvider Provider');
  }

  public authenticated(): boolean {
    return tokenNotExpired('/_ionic/token');
  }

  public ready(){
    return this.STORAGE.ready;
  }

  public async getProfile(){
    let profile = await this.storage.get('Profile');
    return JSON.parse(profile);
  }

  public login(credentials) {
    this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map((res:Response) => res.json)
      .subscribe(
        (data: any) => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

  public signup(credentials) {
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map((res:Response) => res.json)
      .subscribe(
        (data: any) => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

  public logout() {
    this.storage.remove('token');
    this.user = null;
  }

  public authSuccess(token) {
    this.error = null;
    this.storage.set('token', token);
    this.user = this.jwtHelper.decodeToken(token).username;
    this.storage.set('profile', this.user);
  }
  
}
