import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket: io.Socket;

  constructor() {
    this.socket = io.connect('https://llm-fastapi-32f361ff8d8e.herokuapp.com/ws', { transports : ['websocket'] });
  }

  listen(eventname: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventname, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  emit(eventname: string, data: any) {
    this.socket.emit(eventname, data);
  }
}
