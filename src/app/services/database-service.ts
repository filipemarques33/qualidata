import { Injectable } from "@angular/core";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";
import { NetworkRepository } from "../storage/firestore/NetworkRepository";
import { UserRepository } from "../storage/firestore/UserRepository";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private networkRepository: NetworkRepository
  ) {}

  async getProjectById(id: string) {
    return await this.projectRepository.getById(id);
  }

  async getNetworkById(id: string) {
    return await this.networkRepository.getById(id);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getByProperty('email', email);
  }
}