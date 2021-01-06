import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Category from 'src/app/data/Category';
import { DatabaseService } from 'src/app/services/database-service';
import { CategoryService } from 'src/app/services/category-service';
import { Subscription } from 'rxjs';
import Project from 'src/app/data/Project';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  availableCategories: Category[];
  categorySubscription: Subscription;

  selectedParent: Category;
  selectedColor = "#0000FF";

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    parent: new FormControl (null)
  })

  constructor(
    public databaseService: DatabaseService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    let projId = '1'
    this.projectSubscription = this.databaseService.getProject(projId).subscribe(
      project => this.currentProject = project
    )
    this.categorySubscription = this.databaseService.getAllCategories().subscribe(
      categories => {
        this.availableCategories = categories.filter(category => this.currentProject.categories.includes(category.id) && category.parent == null)
      }
    )
  }

  submit() {
    if (this.categoryForm.valid) {
      const projId = '1'
      const category = new Category('', this.categoryForm.get('name').value, this.selectedColor, 'black', this.categoryForm.get('parent').value);
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
    this.selectedParent = parentId ? this.availableCategories.find(category => category.id == parentId) : null
  }

  async getTopLevelCategories(){
    const projId = '1'
    let project = await this.databaseService.getProjectById(projId)
    this.availableCategories = this.categoryService.getParentcategories(await this.databaseService.getCategoriesByIds(project.categories))
  }

}
