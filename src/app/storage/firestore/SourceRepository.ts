import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
//import * as admin from 'firebase-admin';

import { Repository } from '../Repository';
import Source from '../../data/Source';
import { InstantiateExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class SourceRepository extends Repository<Source> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getById(id: string) {
    let source = await this.firebase.collection('sources').doc<Source>(id).get().toPromise();
    return source.data();
  }

  async saveToProject(instance: Source, projId: string) {
    this.firebase.collection('sources').add(
      {"title": instance.title,
      "content": instance.content
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        this.firebase.collection('projects').doc('1').update({
          sources: this.firebase.firestore.FieldValue.arrayUnion({id:docRef.id, title:instance.title})
        })
      }
    )
    return;
  }

}
