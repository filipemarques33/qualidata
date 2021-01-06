import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';
import { VertexUpdateData } from "src/app/services/database-service";

import Code from '../../data/Code';
import { Repository } from '../Repository';

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CodeRepository extends Repository<Code> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getByIds(ids: string[]) {
    let codesRef = await this.firebase.collection<Code>('codes').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', ids).get();
    return codesRef.docs.map(doc => {
      let category = doc.data();
      category.id = doc.id;
      return category;
    });
  }

  async saveToCategories(code: Code, catIds:string[]) {
    let sourceData = {
      'id': code.source.id,
      'range': code.source.range
    }

    let dataToSave = {
      'name': code.name,
      'content': code.content,
      'color': code.color,
      'textColor': code.textColor,
      'source': sourceData,
      'position': code.position ? code.position : null
    }

    let newDocRef = await this.firebase.collection('codes').add(dataToSave)
    for (let id in catIds) {
      await this.firebase.collection('category').doc(id).update({
        codes: firebase.default.firestore.FieldValue.arrayUnion(newDocRef)
      })
    }
  }

  async updateById(id: string, data: VertexUpdateData) {
    await this.firebase.doc<Code>(`codes/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor,
      position: data.position
    });
  }
}
