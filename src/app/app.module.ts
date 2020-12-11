import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


//Servicios
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';

//Socket
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {environment} from '../environments/environment';


const config: SocketIoConfig = { 
  url: environment.wsurl, options: {} 
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [HttpClientModule,SocketIoModule.forRoot(config),BrowserModule, IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot()], 
  providers: [
    Geolocation,
    GooglePlus,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
