import { Injectable } from "@angular/core";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";
import { NetworkRepository } from "../storage/firestore/NetworkRepository";
import { SourceRepository } from "../storage/firestore/SourceRepository";
import { UserRepository } from "../storage/firestore/UserRepository";
import { CategoryRepository } from '../storage/firestore/CategoryRepository';
import { CodeRepository } from '../storage/firestore/CodeRepository';
import Relationship from 'src/app/data/Relationship';
import Source from "src/app/data/Source";
import Category from "src/app/data/Category";
import Code from "../data/Code";

export interface VertexUpdateData {
  id: string;
  name: string;
  color: string;
  textColor: string;
  position: {
    x: number,
    y: number
  };
};

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


  // Project

  async getProjectById(id: string) {
    return await this.projectRepository.getById(id);
  }

  getProject(id: string) {
    return this.projectRepository.getProjectById(id)
  }


  // Network

  async getNetworkById(id: string) {
    return await this.networkRepository.getById(id);
  }

  async getNetworksByIds(ids: string[]) {
    return await this.networkRepository.getByIds(ids);
  }

  // Source

  async getSourceById(id: string) {
    return await this.sourceRepository.getById(id);
  }

  async getSourcesByIds(ids: string[]) {
    return await this.sourceRepository.getByIds(ids);
  }

  // async saveSource(source: Source, projId: string) {
  //   await this.sourceRepository.saveToProject(source, projId);
  // }

    getAllSources() {
      return this.sourceRepository.getAllSources()
    }

  async saveSource(source: Source, projId: string) {
    await this.sourceRepository.saveToProject(source, projId);
  };

  async updateSource(source: Source) {
    await this.sourceRepository.update(source);
  }

  // Category

  async getCategoriesByIds(ids: string[]) {
    return await this.categoryRepository.getByIds(ids);
  }

  getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  // async saveCategory(category: Category, projId: string) {
  //   await this.categoryRepository.saveToProject(category, projId);
  // }

  saveCategory(category: Category, projId: string) {
    this.categoryRepository.saveToProject(category, projId)
  }

  async updateCategories(updateData: VertexUpdateData[]) {
    for (let data of updateData) {
      await this.categoryRepository.updateById(data.id, data);
    }
  }

  // Code

  async getCodesByIds(ids: string[]) {
    return await this.codeRepository.getByIds(ids);
  }

  async saveCode(code: Code, catIds: string[]) {
    await this.codeRepository.saveToCategories(code, catIds);
  }

  async updateCodes(updateData: VertexUpdateData[]) {
    for (let data of updateData) {
      await this.codeRepository.updateById(data.id, data);
    }
  }

  // Relationship

  async updateRelationships(networkId: string, updateRelationships: Relationship[]) {
    await this.networkRepository.updateRelationshipById(networkId, updateRelationships);
  }

  // User

  async getUserByEmail(email: string) {
    return await this.userRepository.getByProperty('email', email);
  }

}
