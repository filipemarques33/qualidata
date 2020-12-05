import { Component, OnInit } from '@angular/core';

import { File } from 'src/app/models/file';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

  newFile = {
    title: '',
    content: ''
  };

  constructor(
    private snackbar: MatSnackBar,
    private networkService: NetworkService
  ) { }

  ngOnInit(): void {
  }

  saveFile(): void {
    console.log('Button clicked');
    const file = this.newFile;
    this.snackbar.open('Documento salvo', null, {
        duration: 2000,
    });
  }

  verifyFields() {
    return (this.newFile.title && this.newFile.content);
  }
}
