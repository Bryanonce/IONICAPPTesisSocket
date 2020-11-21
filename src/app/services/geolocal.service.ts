import { Injectable } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
import { ServicioService } from './servicio.service';
import { MetodoPost } from '../module/post.module';

@Injectable({
  providedIn: 'root'
})
export class GeolocalService {
  public form:MetodoPost;
  public mat:Number = 201500441;
  public longitud:Number;
  public latitud:Number;
  constructor(public geolocation:Geolocation,
    public _servicioService:ServicioService) { }



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
