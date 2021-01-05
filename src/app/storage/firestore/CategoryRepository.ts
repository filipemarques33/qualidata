import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

import Category from '../../data/Category';
import { Repository } from '../Repository';
import { VertexUpdateData } from '../../services/database-service';

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

  async saveToProject(instance: Category, projId: string) {
    var newDocRef = await this.firebase.collection('categories').add({
      'name': instance.name,
      'color': instance.color,
      'categories' : instance.categories ? instance.categories : [],
      'codes' : instance.codes ? instance.codes : [],
      'position' : instance.position ? instance.position : []
    });
    await this.firebase.collection('projects').doc(projId).update({
      categories: firebase.default.firestore.FieldValue.arrayUnion({id: newDocRef.id})
    });
    return;
  }

  async updateById(id: string, data: VertexUpdateData) {
    await this.firebase.doc<Category>(`categories/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor,
      position: data.position
    });
  }
}
