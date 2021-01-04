import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

import Category from '../../data/Category';
import { Repository } from '../Repository';

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryRepository extends Repository<Category> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getByIds(ids: string[]) {
    let categoriesRef = await this.firebase.collection<Category>('categories').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', ids).get();
    return categoriesRef.docs.map(doc => {
      let category = doc.data();
      category.id = doc.id;
      return category;
    });
  }

  async updatePositionById(id: string, position: null|{x: number, y: number}) {
    await this.firebase.doc<Category>(`categories/${id}`).update({position});
  }
}