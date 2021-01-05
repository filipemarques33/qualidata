import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ColorPickerDirective } from 'ngx-color-picker';
import Category from 'src/app/data/Category';
import { DatabaseService } from 'src/app/services/database-service';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {

  avaliableCategories: Category[] = []
  selectedParent: Category;
  selectedColor = "#0000FF";

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    parent: new FormControl (null)
  })

  constructor(
    public databaseService: DatabaseService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.getTopLevelCategories()
  }

  submit() {
    if (this.categoryForm.valid) {
      const projId = '1'
      const category = new Category('', this.categoryForm.get('name').value, this.selectedColor, 'black', this.categoryForm.get('parent').value);
      console.log(category)
      this.databaseService.saveCategory(category, projId);
      this.dialogRef.close();
    } else {
      this.categoryForm.markAsDirty();
    }
  }

  changeColor(newColor: string) {
    this.selectedColor = newColor
  }

  changeParent(parentId) {
    this.selectedParent = parentId ? this.avaliableCategories.find(category => category.id == parentId) : null
  }

  async getTopLevelCategories(){
    const projId = '1'
    let project = await this.databaseService.getProjectById(projId)
    this.avaliableCategories = (await this.databaseService.getCategoriesByIds(project.categories)).filter(category => category.parent == null)
  }

}
