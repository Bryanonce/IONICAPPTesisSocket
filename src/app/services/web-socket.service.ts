import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
//import { Usuario } from '../classes/usuario';
import { Storage } from '@ionic/storage';
import { GeolocalService } from './geolocal.service'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public estadoServer:Boolean =  false;
  //public usuario:Usuario;
  private token:String;

  constructor(private socket: Socket,private _geoLocal: GeolocalService) { 
    this.revisarStatus();
    this.token = this._geoLocal.getToken();
  }

  revisarStatus(){
    this.socket.on('connect',()=>{
      console.log('Conectado al Servidor');
      this.emitirMsj('conectado',{token:this.token});
      this.estadoServer = true;
    })
    this.socket.on('disconnect',()=>{
      console.log('Desconectado del Servidor');
      this.estadoServer = false;
    })
  }

  emitirMsj(event:string,payload?:any,callback?:Function){
    console.log('Emitiendo mensaje');
    //emit('event',payload,callback)
    this.socket.emit(event,payload,callback);
  }

  listendEvent(event:string){
    return this.socket.fromEvent(event)
  }

  loginWS(nombre:string){
    console.log('Configurando',nombre);
    this.socket.emit('configurar-usuario',{nombre},(resp)=>{
      console.log(resp);
    })
  }





}
