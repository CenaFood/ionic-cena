import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelper } from "angular2-jwt";


@Injectable()
export class AuthProvider {


  private LOGIN_URL = "http://localhost:8100/auth/login/";
  private SIGNUP_URL = "http://localhost:8100/auth/register/";

  private contentHeader: HttpHeaders;
  private jwtHelper = new JwtHelper();

  public user:string;
  public error: string;
  private token: string;


  constructor(public http: HttpClient, public storage: Storage) {
    this.contentHeader = new HttpHeaders(
      {
        'Content-Type':  'application/json',
      }); 
  }

  public ready(){
    return Promise.all([
      this.storage.get("user")
        .then(val => this.user=val)
        .catch(() => console.log("No user retrieved")),
      this.storage.get("token")
        .then(val => this.token=val)
        .catch(() => console.log("No token retrieved"))
    ]);
  }

  public authenticated(): boolean {
    return tokenNotExpired("Token", this.token);
  }

  public login(credentials, success?: Function) {
    this.http.post(this.LOGIN_URL, JSON.stringify(credentials), {headers: this.contentHeader})
      .subscribe(
        (data: any) =>{
          this.authSuccess(data, credentials);
          if(success) success();
        },
        err => {this.error = "Login error"; console.log("Error", err);}
      );
  }

  public signup(credentials, success?: Function) {
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .subscribe(
        (data: any) => {
          this.authSuccess(data, credentials);
          if(success) success();
        },
        err => {this.error = "Signup error"; console.log("Error", err);}
      );
  }

  private refreshToken(){
    let user;
    let password;
    Promise.all([
        this.storage.get("user").then(val => user=val),
        this.storage.get("password").then(val => password=val)
      ])
      .then(() => this.login({user,password}));
  }

  public addAuthorizeHeader(headers: HttpHeaders){
    let authHeaderValue = `Bearer ${this.token}`;

    if(this.token && !this.authenticated()){
      this.refreshToken();
    }else{
      return headers.set('Authorization', authHeaderValue);
    }
    return headers;
  }

  public logout() {
    this.storage.remove('token');
    this.storage.remove('user');
    this.storage.remove('password');
    this.token = null;
    this.error = null;
    this.user = null;
  }

  public authSuccess(token, credentials) {
    this.error = null;

    this.token = token;
    this.storage.set('token', token);

    this.user = this.jwtHelper.decodeToken(token).sub;
    this.storage.set('user', this.user);

    //Bad practice, implement jwt refresh on API side
    this.storage.set('password', credentials.password)
  }  
}
