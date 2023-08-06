import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from 'environments/environment';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp(environment.firebaseConfig);
  storage = getStorage(this.app);
  constructor() {

   }

   upload(file:any, refName : string): Promise<any> {
    return uploadBytes(ref(this.storage, refName), file)
   }

}
