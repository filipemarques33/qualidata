import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import Source from 'src/app/data/Source'

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  currentProject = new Project(1, "Pesquisa", "Teste de descrição")
  sources: Source[] = []

  constructor() {}

  ngOnInit(): void {
    this.getSourcesById()
  }

  getSourcesById(){
    for (var i = 1; i < 10; i++) {
      let newSource = new Source(i, "Test Project " + i, "This is a test")
      this.sources.push(newSource)
    }
  }
}
