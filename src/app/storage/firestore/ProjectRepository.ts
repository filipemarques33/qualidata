import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Repository } from '../Repository';

interface Network {
  id: string;
  name: string;
}

interface Source {
  id: string;
  // title: string;
}

interface Category {
  id: string;
  // color: string;
  // name: string;
}

interface Project {
  networks: Network[];
  sources: Source[];
  categories: Category[];
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
