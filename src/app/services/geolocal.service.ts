import { Injectable } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
import { ServicioService } from './servicio.service';
import { MetodoPost } from '../module/post.module';
import { Storage } from '@ionic/storage';

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
      storage.ready().then(()=>{
        if(this.storage.get('userId')){
          this.storage.get('userId')
          .then((response) =>{
            this.mat = response;
          })
        }
        return
      })
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
