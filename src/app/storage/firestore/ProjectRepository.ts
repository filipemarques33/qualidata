import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import Project from "src/app/data/Project";

import { Repository } from '../Repository';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepository extends Repository<Project> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getById(id: string) {
    let project = await this.firebase.collection('projects').doc<Project>(id).get().toPromise();
    return project.data();
  }

  getProjectById(id: string) {
    return this.firebase.collection('projects').doc<Project>(id).valueChanges()
  }

  getAllProjects() {
    return this.firebase.collection<Project>('projects').valueChanges()
  }

}
