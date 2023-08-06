import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { jsonrepair } from 'jsonrepair';
import { Answer, Message } from 'app/interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  constructor(private apiService: ApiService) {}
  @ViewChild('chatContainer') myScrollContainer!: ElementRef;
  @Input() chatIndex: number | undefined;

  chatHistory: {
    user: string;
    content: string;
    chart?: any;
    insight?: string;
    chatId?: number;
  }[] = [];

  inputValue: string = '';
  isLoading: boolean = false;
  errors: number = 0;

  ngOnChanges(): void {
    if (this.chatIndex !== undefined) {
      this.apiService.getMessages(this.chatIndex).subscribe((messages) => {
        this.chatHistory = [];
        messages.forEach((msg: any) => {
          msg.chart = JSON.parse(msg.chart);
          this.chatHistory.push(msg);
        });
      });
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getResponse(question: string) {
    this.apiService.ask({ content: question }).subscribe(
      (res) => {
        if (res) {
          try {
            const repaired = JSON.parse(jsonrepair(res));
            console.log(repaired);
            let answer: Answer = {
              content: repaired.answer,
              chart: repaired[repaired.chart_type],
            };
            console.log(answer);

            this.apiService
              .enrich({ question: question, answer: answer.content })
              .subscribe((res) => {
                if (res) {
                  let msg: Message = {
                    user: 'user',
                    content: question,
                    chatId: this.chatIndex || 0,
                  };
                  this.apiService.addMessage(msg).subscribe();

                  msg = {
                    user: 'bot',
                    content: answer.content,
                    chart: answer.chart,
                    insight: res.content,
                    chatId: this.chatIndex || 0,
                  };

                  this.chatHistory.push(msg);
                  this.apiService
                    .addMessage({ ...msg, chart: JSON.stringify(msg.chart) })
                    .subscribe((response) => console.log(response));
                }
              });
          } catch (err) {
            console.error(err);
            this.getResponse(question);
          }
        }
        this.isLoading = false;
      },
      (err) => {
        if (this.errors < 5) {
          this.errors += 1;
          this.chatHistory.push({
            user: 'bot',
            content: 'Error, retrying ...',
            chatId: this.chatIndex,
          });
          this.getResponse(question);
        } else {
          this.chatHistory.push({
            user: 'bot',
            content: 'Too many retries, wait and try later',
            chatId: this.chatIndex,
          });
        }
      }
    );
  }

  async sendMessage() {
    const userMessage = this.inputValue.trim();

    if (userMessage === '') {
      return;
    }
    let msg: Message = {
      user: 'user',
      content: userMessage,
      chatId: this.chatIndex || 0,
    };
    
    this.chatHistory.push(msg);
    this.inputValue = '';

    this.isLoading = true;

    this.getResponse(userMessage);

    this.errors = 0;
    this.scrollToBottom();
  }
}
