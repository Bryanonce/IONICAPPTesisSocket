import { Component } from '@angular/core';
import { EntragaModule } from '../../../module/entrega.module';
import { WebSocketService } from '../../../services/web-socket.service';
import { GeolocalService } from '../../../services/geolocal.service';
import { ServicioService } from '../../../services/servicio.service';


//env
import { environment } from '../../../../environments/environment';



//Modulos
import { MetodoPost } from '../../../module/post.module';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public ultimaMedicion:EntragaModule = new EntragaModule();
  public medicionesMax:Number = 50;
  public contador:number = 0;
  public inicio:Boolean;
  constructor(public _geolocation:GeolocalService,
              public _servicioService:ServicioService,
              public _webSocket:WebSocketService
              ) {}

    
validacionServicio(){
  if(this.inicio==true){
    this.inicio = false;
  }else{
    this.inicio = true;
    this.buclePost()
  }
}
  async buclePost(){
    do{
      this.contador++
      await this.contadorPromesa()
       .then((resp)=>{
        this._geolocation.suscribirPost()
          .then((response:MetodoPost)=>{
             this._webSocket.emitirMsj('enviarCoordServ',response)
          })
      }).catch((err)=>{
        console.log(err)
      })
    }while(this.inicio===true)
    this.inicio = false;
    console.log('Ha salido del bucle');
    this.contador = 0;
  }

  contadorPromesa(){
    return new Promise((resolve,reject)=>{
      setTimeout(() =>{
        //console.log('Esperando ....');
        resolve(true);
      },10000)
      
    })
  }
}
