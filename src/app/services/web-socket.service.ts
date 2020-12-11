import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
//import { Usuario } from '../classes/usuario';
import { Storage } from '@ionic/storage';
import { GeolocalService } from './geolocal.service'

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public estadoServer:Boolean =  false;
  //public usuario:Usuario;
  private token:String;

  constructor(private socket: Socket,private _geoLocal: GeolocalService,private storage:Storage) { 
    if(!environment.production){
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvRGIiOnsidGlwbyI6IkFDQ0VTT19SRUNVUlNPUyIsImFjdGl2byI6ZmFsc2UsImdvb2dsZSI6ZmFsc2UsImltZyI6IjVmYzU3NTZkMTMzZWU5Nzg3OWE2NWFjMi01MTMucG5nIiwiX2lkIjoiNWZjNTc1NmQxMzNlZTk3ODc5YTY1YWMyIiwiZW1haWwiOiJ0ZXN0MTBAc2FmZW1hcC5jb20iLCJub21icmUiOiJ0ZXN0NSIsIl9fdiI6MH0sImlhdCI6MTYwNzI4MDA2OCwiZXhwIjoxNjA5ODcyMDY4fQ.T1E1aLOoJWVsc5G5AP5ZrO9eodZIkvSJ2oh0ICGZyPg';
    }else{
      this.storage.ready().then(()=>{
        this.storage.get('tokenRest')
          .then((response:string) =>{
            this.token = response;
            this.revisarStatus();
        })
      })
    }
  }

  revisarStatus(conectar?:boolean){
    this.socket.on('connect',()=>{
      console.log('Conectado al Servidor');
      if(conectar){
        this.emitirMsj('conectado',{token:this.token});
      }
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
