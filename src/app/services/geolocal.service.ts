import { Injectable } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
import { ServicioService } from './servicio.service';
import { MetodoPost } from '../module/post.module';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GeolocalService {
  public form:MetodoPost;
  public mat:String;
  public longitud:Number;
  public latitud:Number;
  constructor(public geolocation:Geolocation,
    public _servicioService:ServicioService,
    private storage:Storage
    ) { 
      this.getMat();
    }


  getToken(){
    let token:string;
    if(!environment.production){
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvRGIiOnsidGlwbyI6IkFDQ0VTT19SRUNVUlNPUyIsImFjdGl2byI6ZmFsc2UsImdvb2dsZSI6ZmFsc2UsImltZyI6IjVmYzU3NTZkMTMzZWU5Nzg3OWE2NWFjMi01MTMucG5nIiwiX2lkIjoiNWZjNTc1NmQxMzNlZTk3ODc5YTY1YWMyIiwiZW1haWwiOiJ0ZXN0MTBAc2FmZW1hcC5jb20iLCJub21icmUiOiJ0ZXN0NSIsIl9fdiI6MH0sImlhdCI6MTYwNzI4MDA2OCwiZXhwIjoxNjA5ODcyMDY4fQ.T1E1aLOoJWVsc5G5AP5ZrO9eodZIkvSJ2oh0ICGZyPg';
    }else{
      this.storage.get('tokenRest')
      .then((res:string)=>{
        token = res;
      })
    }
    return token;
  }

  getMat(){
    if(!environment.production){
      this.mat = "5fc5756d133ee97879a65ac2";
    }else{
      this.storage.ready().then(()=>{
        if(this.storage.get('userId')){
          this.storage.get('userId')
          .then((response) =>{
            this.mat = response;
          })
        }
        
      })
    }
    return this.mat
  }

  suscribirPost(){
    return new Promise((resolve,reject)=>{
      try{
        this.geolocation.getCurrentPosition()
        .then((geoposition:Geoposition)=>{
          let lat:Number = geoposition.coords.latitude;
          let long:Number = geoposition.coords.longitude;
          let form = new MetodoPost(this.mat,lat,long);
          resolve(form)
        });
      }catch(err){
        console.warn("Error en la promesa del servicio SuscribirPost")
        reject(err)
      }
    })
  }
}
