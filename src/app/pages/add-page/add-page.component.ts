import { Component } from '@angular/core';
import { Chat } from 'app/interfaces';
import { ApiService } from 'app/services/api.service';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent {
  chatName: string = '';
  chatDescription: string = '';
  chunkSize: number = 100;
  pineconeDimension: number = 1536;
  selectedPdfFile: File | null = null;
  selectedCsvFile: File | null = null;
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private firebaseService: FirebaseService
  ) {}

  onSubmit() {
    this.loading = true;

    let time = new Date().getTime();

    let chat: Chat = {
      name: this.chatName,
      description: this.chatDescription,
      database: `${time}csv`,
      pinecone: `${time}pdf`,
      chunkSize: this.chunkSize,
      pineconeDimension: this.pineconeDimension,
    };

    let p1 = this.firebaseService.upload(this.selectedCsvFile, `${time}csv`);
    let p2 = this.firebaseService.upload(this.selectedPdfFile, `${time}pdf`);

    Promise.all([p1, p2])
      .then(([result1, result2]) => {
        console.log('Csv uploaded', result1);
        console.log('Pdf uploaded', result2);
        this.apiService
          .addChat(chat)
          .subscribe((res) => {
            window.location.reload();
            this.loading = false;
          }
          );
      })
      .catch((error) => {
        this.loading = false;
        console.error('An error occurred:', error);
      });
  }

  onFileSelected(event: any) {
    const inputId = event.target.id;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (inputId === 'pdfFile') {
        this.selectedPdfFile = input.files[0];
      } else if (inputId === 'csvFile') {
        this.selectedCsvFile = input.files[0];
      }
    }
  }
}
