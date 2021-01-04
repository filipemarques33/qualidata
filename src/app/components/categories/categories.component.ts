import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database-service';
import Category from 'src/app/data/Category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from 'src/app/components/categories/new-category-dialog/new-category-dialog.component'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  //currProject: Project = new Project(1, "Pesquisa", "Teste de descrição")
  currProject: any;
  categories: Category[];

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private newCategoryDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  async getCategories(){
    const projId = '1';
    this.currProject = await this.databaseService.getProjectById(projId);
    this.categories = await this.databaseService.getCategoriesByIds(this.currProject.categories.map(category => category.id))
  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false
    }).afterClosed().subscribe(() => {this.getCategories(); console.log("Refreshing")})
  }
}
