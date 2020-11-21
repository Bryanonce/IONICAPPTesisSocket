import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router : Router, private _google:GooglePlus) { }
  loginWithGoogle(){
    return this._google.login({'webClientId': '1003353693226-5p1okcfq6r6ivp1oe99o8o7omfcvu41m.apps.googleusercontent.com'})
    .then((res)=>{
      const user_data_google = res.idToken;
      return user_data_google;      
    })
  }

}