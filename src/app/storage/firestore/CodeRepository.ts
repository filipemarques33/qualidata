import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

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
    return codesRef.docs.map(doc =>  doc.data());
  }

  async saveToProject(code: Code, projectId: string) {

    let codeRef = this.firebase.createId()
    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'description': code.description,
      'fragments': null,
      'color': code.color,
      'textColor': code.textColor,
    }

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave)

    await this.firebase.collection('projects').doc(projectId).update({
      codes: firebase.default.firestore.FieldValue.arrayUnion(codeRef)
    })

    return codeRef

  }

  async saveToCategories(code: Code, catIds: string[]) {

    let codeRef = this.firebase.createId()

    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'description': code.description,
      'fragments': null,
      'color': code.color,
      'textColor': code.textColor,
    }

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave)
    for (let cat of catIds) {
      this.firebase.collection('categories').doc(cat).update({
        'codes': firebase.default.firestore.FieldValue.arrayUnion(codeRef)
      })
    }
  }

  async updateById(id: string, data: Partial<Code>) {
    await this.firebase.doc<Code>(`codes/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor
    });
  }


  async addFragment(id: string, fragmentId: string) {
    await this.firebase.collection('codes').doc(id).update({
      fragments: firebase.default.firestore.FieldValue.arrayUnion(fragmentId)
    })
  }

}
