import { Component, OnInit, OnDestroy } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database-service';
import Category from 'src/app/data/Category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from 'src/app/components/categories/new-category-dialog/new-category-dialog.component'
import { NewCodeDialogComponent } from 'src/app/components/edit-source/new-code-dialog/new-code-dialog.component'
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category-service';
import { ProjectService } from 'src/app/services/project-service';
import { CodeService } from 'src/app/services/code-service';
import Code from 'src/app/data/Code';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  currentProject: Project;
  projectSubscription: Subscription;

  categories: Category[];
  categorySubscription: Subscription;

  codes: Code[];
  codeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private codeService: CodeService,
    private newCategoryDialog: MatDialog
  ) { }

  async ngOnInit() {
    let projId = this.route.snapshot.paramMap.get('projId')
    this.currentProject = await this.projectService.getProjectById(projId)
    this.categories = await this.categoryService.getCategoriesByIds(this.currentProject.categories)
    this.codes = await this.codeService.getCodesByIds(this.currentProject.codes)
  }

  ngOnDestroy() {

  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.currentProject.id),
        category: null
      }
    })
  }

  editCategory(category: Category) {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.currentProject.id),
        category: category
      }
    })
  }

  editCode(code: Code) {
    this.newCategoryDialog.open(NewCodeDialogComponent, {
      autoFocus: false,
      data: {
        code: code
      }
    })
  }
}
