import { Component, OnInit, OnDestroy } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database-service';
import Category from 'src/app/data/Category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from 'src/app/components/categories/new-category-dialog/new-category-dialog.component'
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category-service';
import { ProjectService } from 'src/app/services/project-service';

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


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private newCategoryDialog: MatDialog
  ) { }

  ngOnInit(): void {
    let projId = this.route.snapshot.paramMap.get('projId');
    this.projectSubscription = this.projectService.getProject(projId).subscribe(
      (project) => this.currentProject = project
    )
    this.categorySubscription = this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => this.categories = categories.filter(category => this.currentProject.categories.includes(category.id))
    )
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe()
    this.categorySubscription.unsubscribe()
  }

  async getCategories(){
    const projId = '1';
    this.currentProject = await this.projectService.getProjectById(projId);
    this.categories = await this.categoryService.getCategoriesByIds(this.currentProject.categories);
  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.currentProject.id)
      }
    })
  }
}
