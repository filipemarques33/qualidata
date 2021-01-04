import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database-service';
import Source from 'src/app/data/Source';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  currProject: Project = new Project(1, "Pesquisa", "Teste de descrição")
  sources: Source[] = []

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    this.sources = await this.getSources();
  }

  async getSources(){
    // const projId = this.route.snapshot.paramMap.get('projId');
    const projId = '1';
    let project = await this.databaseService.getProjectById(projId);
    return await this.databaseService.getSourcesByIds(project.sources);
  }
}
