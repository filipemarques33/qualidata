import { EventEmitter, Injectable } from "@angular/core";
import { SourceRepository } from '../storage/firestore/SourceRepository';
import Source from "../data/Source";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  public loadingSources = new EventEmitter<boolean>();
  public sources: Source[] = [];
  public areSourcesLoaded = false;

  constructor (
    private sourceRepository: SourceRepository,
    private authService: AuthService,
    private projectService: ProjectService
  ) {
    this.authService.userLogEvent.subscribe(eventType => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
  }

  async loadUserSources() {
    this.loadingSources.emit(true);
    if (this.authService.user && !this.areSourcesLoaded) {
      this.sources = await this.getSourcesByIds(this.projectService.currentProject.sources);
      this.areSourcesLoaded = true;
    }
    this.loadingSources.emit(true);
  }

  async getSourcesByIds(ids: string[]) {
    return await this.sourceRepository.getByIds(ids);
  }

  async getSourceById(id: string) {
    return await this.sourceRepository.getById(id);
  }

  getAllSources() {
    return this.sourceRepository.getAllSources()
  }

  async saveSource(source: Source, projId: string) {
    await this.sourceRepository.saveToProject(source, projId);
  };

  async addFragment(source: Source, fragmentId: string) {
    await this.sourceRepository.addFragment(source.id, fragmentId);
  }

  async updateContent(source: Source) {
    await this.sourceRepository.updateContent(source);
  }

  private logoutUser() {
    this.areSourcesLoaded = false;
    this.sources = [];
  }

}

