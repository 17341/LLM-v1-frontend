import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question , Messages, Message, Chat, Information} from 'app/interfaces';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const upload_httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    'Accept' : 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) {}

  ask(question : Question): Observable<any> {
    return this.http.post('https://llm-fastapi-32f361ff8d8e.herokuapp.com/question',question, httpOptions);
  }

  enrich(messages : Messages): Observable<any> {
    return this.http.post('https://llm-fastapi-32f361ff8d8e.herokuapp.com/insight',messages, httpOptions);
  }
  add(text : Question): Observable<any> {
    return this.http.post('https://llm-fastapi-32f361ff8d8e.herokuapp.com/add_vector',text, httpOptions);
  }
  getChats(): Observable<any> {
    return this.http.get('https://llm-fastapi-32f361ff8d8e.herokuapp.com/getChats',httpOptions);
  }
  getMessages(chat_id : Number): Observable<any> {
    return this.http.get(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/${chat_id}/getMessages`,httpOptions);
  }
  addMessage(msg : Message): Observable<any> {
    return this.http.post(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/addMessage`, msg,httpOptions);
  }
  addChat(chat : Chat): Observable<any> {
    return this.http.post(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/addChat`, chat,httpOptions);
  }
  addContext(chunkSize : number , fileName : string): Observable<any> {
    return this.http.post(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/addContext`, {chunkSize : chunkSize , fileName : fileName},httpOptions);
  }
  deleteChat(chat_id : Number): Observable<any> {
    return this.http.delete(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/${chat_id}/deleteChat`,httpOptions);
  }
  uploadCsv(csv_file : any): Observable<any> {
    return this.http.post(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/upload/database`, csv_file, httpOptions);
  }
  initialize(infos : Information): Observable<any> {
    return this.http.post(`https://llm-fastapi-32f361ff8d8e.herokuapp.com/init`, infos, httpOptions);
  }
}
