import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss']
})
export class NewProjectDialogComponent implements OnInit {

  form: FormGroup;
  projectTitle: string = "";
  projectDescription: string = "";

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewProjectDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
  }

  createProject(){

  }

}
