import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consulta } from '../module/consulta.module';
import { MetodoPost } from '../module/post.module';



@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private http:HttpClient) { 
    
  }
  getApi(){
    return this.http.get('https://tesisbryanespol.herokuapp.com/datos');
  }
  getDatosJson(url:string,condiciones:Consulta){
    let argumento = `?anioIni=${condiciones.anioIni}&anioFin=${condiciones.anioFin}&mesIni=${condiciones.mesIni}&mesFin=${condiciones.mesFin}&diaIni=${condiciones.diaIni}&diaFin=${condiciones.diaFin}&horaIni=${condiciones.horaIni}&horaFin=${condiciones.horaFin}&minutoIni=${condiciones.minutoIni}&minutoFin=${condiciones.minutoFin}`;
  	return this.http.get(url+argumento)
  }
  postDatosJson(url:string,form:MetodoPost){
    return this.http.post(url,form) 
  }
}
