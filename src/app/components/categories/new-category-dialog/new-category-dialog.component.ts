import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Category from 'src/app/data/Category';
import { DatabaseService } from 'src/app/services/database-service';
import { CategoryService } from 'src/app/services/category-service';
import { Subscription } from 'rxjs';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project-service';

interface DialogData {
  projectId: string;
  category?: Category;
}

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {

  availableCategories: Category[];

  selectedParent: Category;
  selectedColor = "#0000FF";

  editMode: boolean = false

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    description: new FormControl ('', [Validators.required]),
    parent: new FormControl (null)
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public route: ActivatedRoute,
    public databaseService: DatabaseService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public categoryService: CategoryService,
    public projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.availableCategories = this.categoryService.categories.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    if (this.data.category != null) {
      this.editMode = true
      this.categoryForm.get('name').setValue(this.data.category.name)
      this.categoryForm.get('description').setValue(this.data.category.description)
      this.categoryForm.get('parent').setValue(this.data.category.parent)
      this.selectedColor = this.data.category.color
      this.changeParent(this.data.category.parent)
    }
    console.log(this.editMode)
  }

  submit() {
    if (this.categoryForm.valid) {
      this.editMode ? this.updateCategory() : this.saveCategory()
    } else {
      this.categoryForm.markAsDirty();
    }
  }

  changeParent(parentId) {
    this.selectedParent = parentId ? this.availableCategories.find(category => category.id == parentId) : null
  }

  saveCategory() {
    let name = this.categoryForm.get('name').value
    let description = this.categoryForm.get('description').value
    let parent = this.categoryForm.get('parent').value

    let category = new Category('', name, description, this.selectedColor, 'black', parent);
    this.categoryService.saveCategory(category, String(this.data.projectId));
    this.dialogRef.close();
  }

  updateCategory() {
    let name = this.categoryForm.get('name').value
    let description = this.categoryForm.get('description').value
    let parent = this.categoryForm.get('parent').value

    let categoryInfo: Partial<Category>  = { name: name, description: description, parent: parent, color: this.selectedColor }
    this.categoryService.updateCategoryContent(this.data.category, categoryInfo)
    this.dialogRef.close();
  }


}
