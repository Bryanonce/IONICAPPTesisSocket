import { Component } from '@angular/core';


//Servicios
import { WebSocketService } from '../../../services/web-socket.service';
import { ServicioService } from '../../../services/servicio.service';
import * as mapboxgl from 'mapbox-gl';

//Modulos
import { Consulta } from '../../../module/consulta.module';

//Env
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private nuevaCoor:any;
  public coorden = [];
  public consulta:Consulta;
  public anioIni:Number;
  constructor(public _servicioService:ServicioService,
              public _webSocket:WebSocketService) 
  
  {
    this.consulta = new Consulta();
    this._servicioService.getDatosJson(environment.Apirest,this.consulta).subscribe((res:any)=>{
      res.usuarios.forEach((elemento)=>{
        this.coorden.push(
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [elemento.long,elemento.lat]
            }
          }
        );
      })
    });  
  }

  ngOnInit() {
    this.cargarMapa();
    
  }

  cargarMapa(){
    var map = new mapboxgl.Map({ 
      accessToken: environment.claveMapbox,
      container: 'mapa-mapbox', // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-80.096961, -0.712307], // starting position
      zoom: 15 // starting zoom
    })

    

    map.on('load',()=>{
      map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": this.coorden
        }
      });
      this._webSocket.listendEvent('recargar').subscribe((res:{lat:number,long:number})=>{
        this.coorden.push(
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [res.long,res.lat]
            }
          }
        );
        (map.getSource('earthquakes') as mapboxgl.GeoJSONSource).setData({
          "type": "FeatureCollection",
          "features": this.coorden
        });
      })
      
      map.addLayer({
        id: 'trees-point',
        type: 'heatmap',
        source: 'earthquakes',
        paint: {
          'heatmap-color': ['interpolate',['linear'],['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
            ]
        }
      })
    })

  }
  



}
