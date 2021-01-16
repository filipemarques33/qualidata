import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import * as firebase from 'firebase'

import { Repository } from '../Repository';
import Source from '../../data/Source';
import { InstantiateExpr } from '@angular/compiler';
import { updateLanguageServiceSourceFile } from "typescript";
import { SourceService } from "src/app/services/source-service";

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

  async getByIds(ids: string[]) {
    let sources = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      let categoriesRef = await this.firebase.collection<Source>('sources').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', queryArray).get();
      categoriesRef.docs.forEach(doc => {
        let source = doc.data();
        source.id = doc.id;
        sources.push(source);
      });
    }
    return sources;
  }

  getAllSources() {
    return this.firebase.collection<Source>('sources').valueChanges()
  }

  async saveToProject(instance: Source, projId: string) {
    let sourceRef = this.firebase.createId()
    await this.firebase.collection('sources').doc(sourceRef).set({
      'id': sourceRef,
      'title': instance.title,
      'content': instance.content
    })
    await this.firebase.collection('projects').doc(projId).update({
        sources: firebase.default.firestore.FieldValue.arrayUnion(sourceRef)
    })
    return;
  }

  async updateContent(instance: Source) {
    this.firebase.collection('sources').doc(instance.id).update({
      'content': instance.content
    })
  }

  async addFragment(id: string, fragmentId: string) {
    await this.firebase.collection('sources').doc(id).update({
      fragments: firebase.default.firestore.FieldValue.arrayUnion(fragmentId)
    })
  }

  subscribeToSources(ids: string[]){
    let sources = this.firebase.collection<Source>('sources', ref => ref.where('id','in', ids )).valueChanges()
    return sources;
  }

}

