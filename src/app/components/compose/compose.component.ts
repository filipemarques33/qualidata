import { Component, OnInit } from '@angular/core';

import { FileService } from 'src/app/services/file.service';
import { File } from 'src/app/models/file';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';

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
    private fileService: FileService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  saveFile(): void {
    console.log('Button clicked');
    const file = this.newFile;
    this.fileService.saveFile(file).then(() => {
      this.snackbar.open('Documento salvo', null, {
        duration: 2000,
      });
    });
  }

  verifyFields() {
    return (this.newFile.title && this.newFile.content);
  }
}
