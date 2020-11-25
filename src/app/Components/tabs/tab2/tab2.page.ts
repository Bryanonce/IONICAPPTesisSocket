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
  markersMapbox: {_id:string, mark: mapboxgl.Marker}[] = []

  constructor(public _webSocket:WebSocketService, public _servicioServ:ServicioService) {
    
  }

  ngOnInit(){
    this._servicioServ.getDatosSimplex(environment.ApirestUlti).subscribe((res:any)=>{
      res.datos.forEach((element:Lugar)=>{
        this.lugares.push({
          _id: element._id,
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
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYnJ5YW5vbmNlIiwiYSI6ImNrZ3dlMjdtNjA5YTMyeXA2cWNwbHF4YXEifQ.oBbGH3SNhdrk6V7ui4eypQ';
    this.mapa = new mapboxgl.Map({
      container: 'mapa-box',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-80.096961, -0.712307],
      zoom: 15.8
    });

    for(const marcador of this.lugares){
      this.agregarMarcador(marcador);
    }

    this.markersMapbox.forEach((element)=>{
      element.mark.addTo(this.mapa);
    })

    this._webSocket.listendEvent('actualCoor').subscribe((res:{lat:number,long:number,_id:string,nombre:string,img:string,color:string})=>{
      let agregado = false;
          this.markersMapbox.forEach((elemento,index)=>{
            if(elemento._id === res._id){
              this.markersMapbox[index].mark.setLngLat([res.long,res.lat])
              agregado = true;
            }
            if(agregado == false){
              this.agregarMarcador(res)
              this.markersMapbox[index].mark.addTo(this.mapa);
            }
          })
    })
  }


  agregarMarcador(marcador:Lugar){
    const h2 = document.createElement('h2');
    h2.innerText = marcador.nombre;
    
    const img = document.createElement('img');
    img.src = marcador.img;
    
    const div = document.createElement('div');
    div.append(h2,img);

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent(div);
    const marker = new mapboxgl.Marker({
      draggable: false,
      color: marcador.color
    })
    .setLngLat([marcador.long,marcador.lat])
    .setPopup(customPopup);
    this.markersMapbox.push({_id:marcador._id,mark:marker})
  }
}



