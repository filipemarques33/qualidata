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

  currProject: Project = new Project(1, "Pesquisa", "Teste de descrição")
  categories: Category[]

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private newCategoryDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategories().then(
      categories => {
        this.categories = categories
      }
    )
  }

  async getCategories(){
    // const projId = this.route.snapshot.paramMap.get('projId');
    const projId = '1';
    let project = await this.databaseService.getProjectById(projId);
    return await this.databaseService.getCategoriesByIds(project.categories.map(category => category.id))
  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent)
  }
}
