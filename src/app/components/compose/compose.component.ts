import { Component, OnInit } from '@angular/core';

import Source from 'src/app/data/Source';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

  sourceId: string;
  currSourceContent = {title: '', content: ''}

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private networkService: NetworkService
  ) { }

  ngOnInit(): void {
    this.getFileContent();
  }

  getFileContent(): void {
    this.sourceId = this.route.snapshot.paramMap.get('sourceId');
    if (this.sourceId != null) {
      // get current File via File Service
      console.log("File ID = " + this.sourceId);
      this.currSourceContent = {title: 'Source test', content: 'This is the current content of this source'};
    } else {
      // get new file
      console.log("New File");
    }


  }

  saveFile(): void {
    console.log('Button clicked');
    this.snackbar.open('Documento salvo', null, {
        duration: 2000,
    });
  }

  verifyFields() {
    return (this.currSourceContent.title && this.currSourceContent.content)
  }
}
