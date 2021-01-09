import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

import Fragment from '../../data/Fragment';
import { Repository } from '../Repository';

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FragmentRepository extends Repository<Fragment> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getByIds(ids: string[]) {
    let codesRef = await this.firebase.collection<Fragment>('fragments').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', ids).get();
    return codesRef.docs.map(doc => doc.data());
  }

  subscribeToAll() {
    return this.firebase.collection<Fragment>('fragments').valueChanges()
  }

  async saveFragment(fragment: Fragment) {
    let fragRef = this.firebase.createId()

    let saveRange = {
      startXPath: fragment.range.startXPath,
      startOffset: fragment.range.startOffset,
      endXPath: fragment.range.endXPath,
      endOffset: fragment.range.endOffset
    }

    let saveData = {
      id: fragRef,
      sourceId: fragment.sourceId,
      range: saveRange,
      content: fragment.content,
      codes: fragment.codes
    }

    console.log(saveData)

    await this.firebase.collection('fragments').doc(fragRef).set(saveData)
    return fragRef

  }

  // async saveToProject(code: Code, projectId: string) {

  //   let codeRef = this.firebase.createId()
  //   let dataToSave = {
  //     'id': codeRef,
  //     'name': code.name,
  //     'description': code.description,
  //     'fragments': null,
  //     'color': code.color,
  //     'textColor': code.textColor,
  //   }

  //   await this.firebase.collection('codes').doc(codeRef).set(dataToSave)

  //   await this.firebase.collection('projects').doc(projectId).update({
  //     categories: firebase.default.firestore.FieldValue.arrayUnion(codeRef)
  //   })

  // }

  // async saveToCategories(code: Code, catIds: string[]) {

  //   let codeRef = this.firebase.createId()

  //   let dataToSave = {
  //     'id': codeRef,
  //     'name': code.name,
  //     'description': code.description,
  //     'fragments': null,
  //     'color': code.color,
  //     'textColor': code.textColor,
  //   }

  //   await this.firebase.collection('codes').doc(codeRef).set(dataToSave)
  //   for (let cat of catIds) {
  //     this.firebase.collection('categories').doc(cat).update({
  //       'codes': firebase.default.firestore.FieldValue.arrayUnion(codeRef)
  //     })
  //   }
  // }

  // async updateById(id: string, data: Partial<Code>) {
  //   await this.firebase.doc<Code>(`codes/${id}`).update({
  //     name: data.name,
  //     color: data.color,
  //     textColor: data.textColor
  //   });
  // }
}
