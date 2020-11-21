import { Component } from '@angular/core';
import { WebSocketService } from '../../../services/web-socket.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public _webSocket:WebSocketService) {}

}
