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

  ngOnInit() {
    let projId = this.route.snapshot.paramMap.get('projId')
    this.projectSubscription = this.projectService.getProject(projId).subscribe(
      project => this.currentProject = project
    )
    this.sourceSubscription = this.sourceService.getAllSources().subscribe(
      sources => this.sources = sources.filter(source => this.currentProject.sources.includes(source.id))
    )
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe()
    this.sourceSubscription.unsubscribe()
  }
}
