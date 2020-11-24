import { Component, OnInit } from '@angular/core';


//Servicios
import { WebSocketService } from '../../../services/web-socket.service';
import { ServicioService } from '../../../services/servicio.service';
import * as mapboxgl from 'mapbox-gl';
import { Lugar } from '../../../models/interfaces';


//Modulos
import { Consulta } from '../../../module/consulta.module';

//Env
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{


  lugares:Lugar[] = [];
  mapa: mapboxgl.Map;

  constructor(public _webSocket:WebSocketService, public _servicioServ:ServicioService) {
    
  }

  ngOnInit(){
    this._servicioServ.getDatosSimplex(environment.ApirestUlti).subscribe((res:any)=>{
      res.datos.forEach((element:Lugar)=>{
        this.lugares.push({
          nombre: element.nombre,
          img: element.img,
          lat: element.lat,
          long: element.long,
          color: element.color
        })
      })
      return this.crearMapa();
    })
  }

  

  crearMapa(){
    var map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiYnJ5YW5vbmNlIiwiYSI6ImNrZ3dlMjdtNjA5YTMyeXA2cWNwbHF4YXEifQ.oBbGH3SNhdrk6V7ui4eypQ',
      container: 'mapa-box',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [12.550343, 55.665957],
      zoom: 8
    });
    
    const marker = new mapboxgl.Marker()
    marker.setLngLat([12.550343, 55.665957])
    marker.addTo(map);
  }


  agregarMarcador(marcador:Lugar){
    
  }
  
}
