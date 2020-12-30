import { Injectable } from "@angular/core";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";
import { UserRepository } from "../storage/firestore/UserRepository";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private networkRepository: ProjectRepository
  ) {}

  async getNetworkById(id: number) {
    let network = await this.networkRepository.getById('1');
    console.log(network);
    return network;
  }
}