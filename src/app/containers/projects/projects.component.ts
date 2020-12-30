import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Project } from 'src/app/models/project';

import { NewProjectDialogComponent } from './new-project-dialog/new-project-dialog.component'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(public newProjectDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openNewProjectDialog() {
    const dialogRef = this.newProjectDialog.open(NewProjectDialogComponent, {
      maxHeight: '400px',
      width: '600px',
    })
  }

}
