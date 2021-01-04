import { Injectable } from "@angular/core";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";
import { NetworkRepository } from "../storage/firestore/NetworkRepository";
import { SourceRepository } from "../storage/firestore/SourceRepository";
import { UserRepository } from "../storage/firestore/UserRepository";
import Source from "src/app/data/Source";
import { CategoryRepository } from '../storage/firestore/CategoryRepository';
import { CodeRepository } from '../storage/firestore/CodeRepository';
import Relationship from '../data/Relationship';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private networkRepository: NetworkRepository,
    private sourceRepository: SourceRepository,
    private categoryRepository: CategoryRepository,
    private codeRepository: CodeRepository
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

  async getNetworksByIds(ids: string[]) {
    return await this.networkRepository.getByIds(ids);
  }

  async getCategoriesByIds(ids: string[]) {
    return await this.categoryRepository.getByIds(ids);
  }

  async getCodesByIds(ids: string[]) {
    return await this.codeRepository.getByIds(ids);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getByProperty('email', email);
  }

  async updateCategoriesPositions(updateCategories: {id: string, position: null|{x: number, y: number}}[]) {
    for (let updateData of updateCategories) {
      await this.categoryRepository.updatePositionById(updateData.id, updateData.position);
    }
  }

  async updateCodesPositions(updateCodes: {id: string, position: null|{x: number, y: number}}[]) {
    for (let updateData of updateCodes) {
      await this.codeRepository.updatePositionById(updateData.id, updateData.position);
    }
  }

  async updateRelationships(networkId: string, updateRelationships: Relationship[]) {
    await this.networkRepository.updateRelationshipById(networkId, updateRelationships);
  }
}
