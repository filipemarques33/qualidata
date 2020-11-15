import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { File } from 'src/app/models/file';

@Injectable({
  providedIn: 'root'
})

export class FileService {

  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  saveFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = this.angularFirestore.createId();
      this.angularFirestore.collection('files').doc(id).set({
        ...file,
        id,
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }
}
