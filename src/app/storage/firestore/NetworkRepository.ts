import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Repository } from '../Repository';
import Network from '../../data/Network';

@Injectable({
  providedIn: 'root'
})
export class NetworkRepository extends Repository<Network> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getById(id: string) {
    let network = await this.firebase.collection('networks').doc<Network>(id).get().toPromise();
    return network.data();
  }
}