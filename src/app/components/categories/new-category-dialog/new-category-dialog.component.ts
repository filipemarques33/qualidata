import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorPickerDirective } from 'ngx-color-picker';
import Category from 'src/app/data/Category';
import { DatabaseService } from 'src/app/services/database-service';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {
  public toggle: boolean = false;

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
  })
  selectedColor = "#0000FF"

  constructor(
    public databaseService: DatabaseService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  submit() {
    if (this.categoryForm.valid) {
      const projId = '1'
      const category = new Category('',this.categoryForm.get('name').value, this.selectedColor)
      console.log('Save ' + category.name + ' ' + category.color)
      this.databaseService.saveCategory(category, projId);
      this.dialogRef.close();
    } else {
      this.categoryForm.markAsDirty();
    }
  }

  changeColor(newColor: string) {
    this.selectedColor = newColor
  }

}
