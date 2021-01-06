import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs';
import Category from 'src/app/data/Category';
import Code from 'src/app/data/Code';
import Project from 'src/app/data/Project';
import { CategoryService } from 'src/app/services/category-service';
import { DatabaseService } from 'src/app/services/database-service';
import { EditorSelection } from 'tinymce';
import { NewCategoryDialogComponent } from '../../categories/new-category-dialog/new-category-dialog.component';

interface DialogData {
  id: string;
  selection: EditorSelection;
}

@Component({
  selector: 'app-tagging-dialog',
  templateUrl: './tagging-dialog.component.html',
  styleUrls: ['./tagging-dialog.component.scss']
})

export class TaggingDialogComponent implements OnInit {

  selectedFragment: EditorSelection;
  fragmentText: string;
  currSource: string;

  availableCategories: Category[] = []
  categorySubscription: Subscription

  currentProject: Project
  projectSubscription: Subscription


  fragmentForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    categories: new FormControl("", [Validators.required])
  })
  selectedColor: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<TaggingDialogComponent>,
    public categoryDialog: MatDialog,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    // this.getCategories();
    this.currSource = this.data.id;
    this.selectedFragment = this.data.selection;
    this.fragmentText = this.decodeHtml(this.selectedFragment.getContent());
    this.setupSubscriptions()
  }

  decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  async getCategories(){
    let projId = '1'
    let project = await this.databaseService.getProjectById(projId)
    this.availableCategories = await this.databaseService.getCategoriesByIds(project.categories)
  }

  setupSubscriptions(){
    let projId = '1'
    this.projectSubscription = this.databaseService.getProject(projId).subscribe(
      (project) => this.currentProject = project
    )
    this.categorySubscription = this.databaseService.getAllCategories().subscribe(
      (categories: Category[]) => this.availableCategories = categories.filter(category => this.currentProject.categories.includes(category.id))
    )
  }

  newCategoryDialog() {
    this.categoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
    })
  }

  submit() {
    let code = new Code(
      '',
      this.fragmentForm.get('name').value,
      this.fragmentText,
      this.selectedColor,
      { id: this.currSource,
        range: this.selectedFragment.getRng() },
      "black"
    )

    let categories = this.fragmentForm.get('categories').value

    console.log(categories)
    categories = ["Sy6e4Fokvm7lHuJLUjl1"]

    //console.log(this.selectedFragment.getRng())

    //this.databaseService.saveCode(code, categories)

    this.dialogRef.close()
  }


}
