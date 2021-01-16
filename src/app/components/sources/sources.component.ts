import { Component, OnDestroy, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { SourceService } from 'src/app/services/source-service';
import Source from 'src/app/data/Source';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project-service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit, OnDestroy {

  currentProject: Project;
  projectSubscription: Subscription;

  sources: Source[]
  sourceSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private projectService: ProjectService
  ) {}

  async ngOnInit() {
    let projId = this.route.snapshot.paramMap.get('projId')
    this.currentProject = await this.projectService.getProjectById(projId)
    this.sources = await this.sourceService.getSourcesByIds(this.currentProject.sources)
  }

  ngOnDestroy() {
    //this.projectSubscription.unsubscribe()
    // this.sourceSubscription.unsubscribe()
  }
}
