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

  async getByIds(ids: string[]): Promise<Code[]> {
    let codes = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      let fragmentsRef = await this.firebase.collection<Code>('codes').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', queryArray).get();
      fragmentsRef.docs.forEach(doc => {
        let code = doc.data();
        code.id = doc.id;
        codes.push(code);
      });
    }
    return codes;
  }

  subscribeToCodes(ids: string[]){
    let codes = this.firebase.collection<Code>('codes', ref => ref.where('id', 'in', ids)).valueChanges()
    return codes
  }

  async saveToProject(code: Code, projectId: string) {

    let codeRef = this.firebase.createId()
    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'description': code.description,
      'fragments': null,
      'parent': code.parent ? code.parent : null,
      'color': code.color,
      'textColor': code.textColor,
    }

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave)

    await this.firebase.collection('projects').doc(projectId).update({
      codes: firebase.default.firestore.FieldValue.arrayUnion(codeRef)
    })

    if (code.parent) {
      await this.firebase.collection('categories').doc(code.parent).update({
        codes: firebase.default.firestore.FieldValue.arrayUnion(codeRef)
      })
    }

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

  async updateContent(code: Code, data: Partial<Code>) {
    if (code.parent != data.parent) {
      if (data.parent) {
        this.firebase.collection('codes').doc(data.parent).update({
          categories: firebase.default.firestore.FieldValue.arrayUnion(code.id)
        })
      }
      if (code.parent) {
        this.firebase.collection('categories').doc(code.parent).update({
          categories: firebase.default.firestore.FieldValue.arrayRemove(code.id)
        })
      }
    }

    await this.firebase.doc<Code>(`codes/${code.id}`).update({
      name: data.name,
      description: data.description,
      parent: data.parent ? data.parent : null,
      color: data.color
    });
  }

}
