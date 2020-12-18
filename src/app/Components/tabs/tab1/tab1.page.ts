import { Component } from '@angular/core';

//Servicios
import { WebSocketService } from '../../../services/web-socket.service';
import { ServicioService } from '../../../services/servicio.service';
import * as mapboxgl from 'mapbox-gl';

//Modulos
import { Consulta } from '../../../module/consulta.module';
import { ConfigureRest } from '../../../module/restConfig.module';
import { ConfigResponse } from '../../../module/restConfigGet.module'

//Env
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  mapa: mapboxgl.Map;
  private realTime: Boolean = false;
  public unoHours: Boolean = false;
  public dosHours: Boolean = true;
  public tresHours: Boolean = false;
  public evento:string = 'recargar';
  public coorden = [];
  public consulta:Consulta;
  public anioIni:Number;
  public configMapa: ConfigureRest = new ConfigureRest();

  constructor(public _servicioService:ServicioService,
              public _webSocket:WebSocketService) 
  
  {
    
    this.consulta = new Consulta();
    this._servicioService.getDatosSimplex(environment.ApirestConfig)
    .subscribe((resp:ConfigResponse)=>{
      if(resp.ok){
        this.configMapa = new ConfigureRest(
          resp.config.latcentro,
          resp.config.longcentro,
          resp.config.latini,
          resp.config.latfin,
          resp.config.longini,
          resp.config.latfin,
          resp.config.escala
          );
      }
      console.log(this.configMapa);
      this._webSocket.listendEvent(this.evento).subscribe((res:{lat:number,long:number,_id?:string})=>{
        if(this.realTime === true){
          this.coorden = []
          this._servicioService.getDatosSimplex(environment.ApirestUlti).subscribe((res:any)=>{
            res.datos.forEach((elemento)=>{
              this.coorden.push(
                {
                  "type": "Feature",
                  "properties": {"mag": this.configMapa.escala, name:elemento._id},
                  "geometry": {
                    "type": "Point",
                    "coordinates": [elemento.long,elemento.lat]
                  }
                }
              );
            })
          })
        }else{
          this.coorden.push(
            {
              "type": "Feature",
              "properties": {"mag": this.configMapa.escala},
              "geometry": {
                "type": "Point",
                "coordinates": [res.long,res.lat]
              }
            }
          );
        }
        (this.mapa.getSource('earthquakes') as mapboxgl.GeoJSONSource).setData({
          "type": "FeatureCollection",
          "features": this.coorden
        });
      })
      this.cargarCheck(2);
    })
    
  }

  ngOnInit() {
    
  }



  generarConsulta(horasMenos:number,diasMenos?:number):Consulta{
    let fecha = new Date()
    if(!diasMenos){
      let _consulta = new Consulta(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate() - (diasMenos || 0),
        fecha.getHours()- horasMenos - environment.horaDesf
      )
      console.log(_consulta);
      return _consulta;
    }else{
      let _consulta = new Consulta(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate() - (diasMenos || 0)
      )
      console.log(_consulta);
      return _consulta;
    }
  }

  cargarCheck(numero:number){
    switch(numero){
      case 1:
        this.realTime = false;
        this.cargarDatos(this.generarConsulta(0,1))
        .then((resp)=>{
          //console.log(resp)
          this.cargarMapa();
        })
        break;
      case 2:
        this.realTime = false;
        this.cargarDatos(this.generarConsulta(6))
        .then((resp)=>{
          //console.log(resp)
          this.cargarMapa();
        })
        break;
      case 3:
        this.realTime = false;
        this.cargarDatos(this.generarConsulta(1))
        .then((resp)=>{
          //console.log(resp)
          this.cargarMapa();
        })
        break;
      default:
        this.realTime = true;
        this.cargarDatos()
        .then((resp)=>{
          //console.log(resp)
          this.cargarMapa();
        })
        break;
    }
    
  }


  cargarDatos(consulta?:Consulta){
    return new Promise((resolve,reject)=>{
      this.coorden = [];
      if(consulta){
        this._servicioService.getDatosJson(environment.Apirest,consulta).subscribe((res:any)=>{
          res.usuarios.forEach((elemento)=>{
            this.coorden.push(
              {
                "type": "Feature",
                "properties": {"mag": this.configMapa.escala},
                "geometry": {
                  "type": "Point",
                  "coordinates": [elemento.long,elemento.lat]
                }
              }
            );
          })
        });
      }else{
        this._servicioService.getDatosSimplex(environment.ApirestUlti).subscribe((res:any)=>{
          res.datos.forEach((elemento)=>{
            this.coorden.push(
              {
                "type": "Feature",
                "properties": {"mag": this.configMapa.escala, name:elemento._id},
                "geometry": {
                  "type": "Point",
                  "coordinates": [elemento.long,elemento.lat]
                }
              }
            );
          })
        })
      }
      resolve(this.coorden);
    })
    
  }

  cargarMapa(){
    this.mapa = new mapboxgl.Map({ 
      accessToken: environment.claveMapbox,
      container: 'mapa-mapbox', // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.configMapa.longcentro, this.configMapa.latcentro], // starting position
      zoom: 15 // starting zoom
    })
    this.mapa.on('load',()=>{
      this.mapa.addSource('earthquakes', {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": this.coorden
        }
      });
      this.mapa.addLayer({
        id: 'trees-point',
        type: 'heatmap',
        source: 'earthquakes',
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1
            ],
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
      }, 'waterway-label')
    })

  }
  


}
