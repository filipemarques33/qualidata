import { Injectable } from "@angular/core";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";
import { NetworkRepository } from "../storage/firestore/NetworkRepository";
import { SourceRepository } from "../storage/firestore/SourceRepository";
import { UserRepository } from "../storage/firestore/UserRepository";
import Source from "src/app/data/Source";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private networkRepository: NetworkRepository,
    private sourceRepository: SourceRepository,
  ) {}

  async getProjectById(id: string) {
    return await this.projectRepository.getById(id);
  }

  async getNetworkById(id: string) {
    return await this.networkRepository.getById(id);
  }

  async getSourceById(id: string) {
    return await this.sourceRepository.getById(id);
  }

  async saveSource(source: Source, projId: string) {
    await this.sourceRepository.saveToProject(source, projId);
  }

  async updateSource(source: Source) {
    await this.sourceRepository.update(source);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getByProperty('email', email);
  }
}
