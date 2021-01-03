import { Component, OnInit } from '@angular/core';

import Source from 'src/app/data/Source';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';
import { DatabaseService } from 'src/app/services/database-service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.scss']
})
export class EditSourceComponent implements OnInit {

  currSource = new Source('', '', '');

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getSourceContent().then(
      source => this.currSource = source
    );
  }

  async getSourceContent() {
    const sourceId = this.route.snapshot.paramMap.get('sourceId');
    let source = await this.databaseService.getSourceById(sourceId);
    return new Source(sourceId, source.title, source.content);
  }

  updateFile(): void {
    this.databaseService.updateSource(this.currSource).then(
      () => {
        this.snackbar.open('Documento atualizado', null, {
          duration: 2000,
        })
      }
    )
  }

  verifyFields() {
    return (this.currSource.title && this.currSource.content)
  }

}
