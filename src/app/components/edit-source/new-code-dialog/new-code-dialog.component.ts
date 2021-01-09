import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'
import Code from 'src/app/data/Code';

@Component({
  selector: 'app-new-code-dialog',
  templateUrl: './new-code-dialog.component.html',
  styleUrls: ['./new-code-dialog.component.scss']
})
export class NewCodeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewCodeDialogComponent>,
  ) { }

  codeForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })
  selectedColor = "#0000FF"

  ngOnInit(): void {
  }

  submit() {
    if (this.codeForm.valid) {
      let title = this.codeForm.get('title').value
      let description = this.codeForm.get('description').value
      let code = new Code('', title, description, [], this.selectedColor)
      this.dialogRef.close(code)
    } else {
      this.codeForm.markAsDirty()
    }
  }
}
