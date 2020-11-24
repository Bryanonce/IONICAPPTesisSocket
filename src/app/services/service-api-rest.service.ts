import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServiceApiRestService {

  constructor(public _http:HttpClient) { }

  loginRestGoogle(token:String){
    return this._http.post(environment.ApiGoogle,{idtoken:token})
  }

}
