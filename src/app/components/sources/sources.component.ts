import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import File from 'src/app/data/File'

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  currentProject = new Project(1, "Pesquisa", "Teste de descrição")
  sources: File[] = []

  constructor() {}

  ngOnInit(): void {
    this.getSourcesById()
  }

  getSourcesById(){
    for (var i = 1; i < 10; i++) {
      let newFile = new File(i, "Test Project " + i, "This is a test")
      this.sources.push(newFile)
    }
  }
}
