import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelper } from "angular2-jwt";


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {


  private LOGIN_URL = "https://cenaswiper.luethi.rocks/auth/login/";
  private SIGNUP_URL = "https://cenaswiper.luethi.rocks/auth/register/";

  private contentHeader;
  private jwtHelper = new JwtHelper();

  public user:string;
  public error: string;
  private token: string;

  constructor(public http: HttpClient, public storage: Storage) {
    this.contentHeader = new HttpHeaders();
    this.contentHeader.append('content-type','application/json');
    console.log('Hello AuthProvider Provider');
  }

  public authenticated(): boolean {
    return tokenNotExpired("Token", this.token);
  }

  public ready(){
    return this.storage.ready;
  }

  public async getProfile(){
    let profile = await this.storage.get('Profile');
    return JSON.parse(profile);
  }

  public login(credentials) {
    console.log(credentials);
    this.http.post(this.LOGIN_URL, JSON.stringify(credentials), {headers: this.contentHeader})
      .map((res:Response) => res.json())
      .subscribe(
        (data: any) => this.authSuccess(data),
        err => {this.error = err; console.log("Error", err);}
      );
  }

  public signup(credentials) {
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map((res:Response) => res.text())
      .subscribe(
        (data: any) => this.authSuccess(String(data)),
      err => {this.error = err; console.log("Error", err);}
      );
  }

  public addAuthorizeHeader(headers: HttpHeaders){
    let authHeaderValue = `Bearer ${this.token}`;

    if(!(headers.get("authorization") == authHeaderValue) && this.token != null){
      headers.append("authorization", `Bearer ${this.token}`);
    }  

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
