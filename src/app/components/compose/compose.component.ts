import { Component, OnInit } from '@angular/core';

import Source from 'src/app/data/Source';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';
import { DatabaseService } from 'src/app/services/database-service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

  currSource = new Source('', '', '');

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit(): void {  }

  saveFile(): void {
    // const projId = this.route.snapshot.paramMap.get('projId');
    this.databaseService.saveSource(this.currSource, '1').then(
      () => {
        this.snackbar.open('Documento salvo', null, {
          duration: 2000,
        })
        this.location.back()
      }
    )
  }

  verifyFields() {
    return (this.currSource.title && this.currSource.content)
  }
}
