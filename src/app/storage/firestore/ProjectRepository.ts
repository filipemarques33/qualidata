import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Repository } from '../Repository';

interface Network {
  id: number;
  name: string;
}

interface Project {
  networks: Network[];
}

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
}