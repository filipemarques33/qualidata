import { Component, createPlatformFactory, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Category from 'src/app/data/Category';
import { DatabaseService } from 'src/app/services/database-service';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {

  category = new Category('','','#0000FF',[],[]);

  // categoryForm = new FormControl({
  //   name: '',
  //   color: '',
  //   disabled: false
  // }, [Validators.required]);

  categoryForm = new FormGroup({
    name: new FormControl (this.category.name, [Validators.required]),
    color: new FormControl (this.category.color, [Validators.required])
  })

  constructor(
    public databaseService: DatabaseService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.category.name)
    console.log(this.categoryForm.get('name'))
  }

  submit() {
    if (this.categoryForm.valid) {
      const projId = '1'
      const category = new Category('',this.categoryForm.get('name').value, this.categoryForm.get('color').value)
      this.databaseService.saveCategory(category, projId);
      this.dialogRef.close();
    } else {
      this.categoryForm.markAsDirty();
    }
  }

}
