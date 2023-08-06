import { Component } from '@angular/core';
import { Chat } from 'app/interfaces';
import { ApiService } from 'app/services/api.service';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent {
  chats: Chat[] = [];
  selectedChat: Chat | undefined;
  addingChat: boolean = false;
  addingContext: boolean = false;
  chatIndex: number = 0;
  selectedPdfFile: File | null = null;
  loading: boolean = false;
  chunkSize : number = 100;

  constructor(private apiService: ApiService, private firebaseService : FirebaseService) {}

  ngOnInit() {
    this.apiService.getChats().subscribe((chats) => {
      chats.forEach((chat: any) => {
        this.chats.push(chat);
      });
    });
  }

  selectChat(chat: Chat) {
    this.apiService
      .initialize({ pinecone: chat.pinecone, database: chat.database, description: chat.description})
      .subscribe(() => {
        this.addingChat = false;
        this.selectedChat = chat;
        this.chatIndex = chat.id || 0;
      });
  }

  addChat() {
    this.addingChat = true;
  }

  addContext() {
    this.addingContext= true;
  }
  onSubmit(){
    let time = new Date().getTime();
    this.loading = true;

    this.firebaseService.upload(this.selectedPdfFile, `${time}pdf`).then(() => {
      this.apiService.addContext(this.chunkSize, `${time}pdf`).subscribe((res) => { 
        this.addingContext= false; 
        this.loading = false;
      });
    })
  }
  closeAddContext()
  {
    this.addingContext= false;
  }

  quitChat() {
    this.selectedChat = undefined;
  }
  deleteChat(chat: Chat) {
    let idx = chat.id;
    if (idx) {
      this.apiService.deleteChat(idx).subscribe(() => {
        this.selectedChat = undefined;
      });
      this.chats = this.chats.filter((chat) => chat.id !== idx);
    }
  }

  onFileSelected(event: any) {
    const inputId = event.target.id;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (inputId === 'pdfFile') {
        this.selectedPdfFile = input.files[0];
      }
    }
  }
}
