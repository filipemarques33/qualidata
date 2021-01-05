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

  async updateById(id: string, data: VertexUpdateData) {
    await this.firebase.doc<Code>(`codes/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor,
      position: data.position
    });
  }
}