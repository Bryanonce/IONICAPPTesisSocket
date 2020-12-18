import { Component } from '@angular/core';
import { EntragaModule } from '../../../module/entrega.module';
import { WebSocketService } from '../../../services/web-socket.service';
import { GeolocalService } from '../../../services/geolocal.service';
import { ServicioService } from '../../../services/servicio.service';
import { Router } from '@angular/router';


import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Storage } from '@ionic/storage';


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
  public ultimaMedicion: EntragaModule = new EntragaModule();
  public medicionesMax: Number = 50;
  public contador: number = 0;
  public inicio: Boolean;
  constructor(public _geolocation: GeolocalService,
    public _servicioService: ServicioService,
    public _webSocket: WebSocketService,
    private localNotifications: LocalNotifications,
    private storage: Storage,
    public router: Router
  ) {
    this._webSocket.revisarStatus(true);
    this.storage.ready().then(() => {
      this.storage.get('userId')
        .then((userId: string) => {
          this._webSocket.listendEvent('avisoPeligro')
            .subscribe((data: { id: string, peligro: boolean }) => {
              if (data.id === userId && data.peligro === true) {
                if (!environment.production) {
                  alert('Peligro inminente');
                } else {
                  this.llamarNoti();
                }
              }
            })
        })
    })
  }

  llamarNoti() {
    let isAndroid = true;
    this.localNotifications.schedule({
      id: 1,
      text: 'Es probable que se encuentre en una zona de Peligro',
      sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
      data: { secret: 'Hola' }
    });
  }

  validacionServicio() {
    if (this.inicio == true) {
      this.inicio = false;
    } else {
      this.inicio = true;
      this.buclePost()
    }
  }

  async buclePost() {
    let dataCoor: MetodoPost[] = [];
    let count = 0
    let numArray:number = 5
    do {
      if (count < numArray) {
      } else {
        count = 0;
        dataCoor.splice(0,dataCoor.length);
      }
      this.contador++;
      count++;
      await this._geolocation.suscribirPost()
        .then((res: MetodoPost) => {
          dataCoor.push(res);
          return this.contadorPromesa(500);
        }).then(() => {
          //console.log(dataCoor);
          if(dataCoor.length === numArray){
            this._webSocket.emitirMsj('enviarCoordServ',dataCoor)
          }
        })
      
    } while (this.inicio === true /*&& this.contador <= 5*/)
    this.inicio = false;
    console.log('Ha salido del bucle');
    this.contador = 0;
  }

  contadorPromesa(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, time)

    })
  }

  cerrarSesion() {
    this.storage.remove('googleAuth')
      .then(() => {
        return this.storage.remove('userId')
      })
      .then(() => {
        this.router.navigate(['/']);
      })
  }

}
