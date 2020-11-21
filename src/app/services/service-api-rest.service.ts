import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiRestService {

  constructor(public _http:HttpClient) { }

  loginRestGoogle(token:String){
    return this._http.post('https://loginservertesis.herokuapp.com/google',{idtoken:token})
  }

}
