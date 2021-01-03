import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import * as firebase from 'firebase'

import { Repository } from '../Repository';
import Source from '../../data/Source';
import { InstantiateExpr } from '@angular/compiler';
import { updateLanguageServiceSourceFile } from "typescript";

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
    var newDocRef: DocumentReference;
    this.firebase.collection('sources').add(
      {'title': instance.title,
      'content': instance.content
    }).then(function(docRef) {
        newDocRef = docRef;
      }
    ).finally(
      () => {
        const sourceRef =  {id: newDocRef.id, title: instance.title};
        this.firebase.collection('projects').doc(projId).update({
          sources: firebase.default.firestore.FieldValue.arrayUnion(sourceRef)
        })
      }
    )
    return;
  }


  async update(instance: Source) {
    this.firebase.collection('sources').doc(instance.id).update({
      content: instance.content
    })
  }
}

