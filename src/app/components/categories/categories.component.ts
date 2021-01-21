import { Component, OnInit, OnDestroy, ViewChild, Type } from '@angular/core';
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
import { MatSidenav } from '@angular/material/sidenav';
import Fragment from 'src/app/data/Fragment';
import { FragmentService } from 'src/app/services/fragment-service';
import { MatListItem } from '@angular/material/list';

interface ListItem {
  level: number,
  node,
  type,
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  categories: Category[];
  categorySubscription: Subscription;

  codes: Code[];
  codeSubscription: Subscription;

  treeList: ListItem[]

  @ViewChild('codeDetails') codeDetailsRef: MatSidenav;
  selectedCode: Code = null
  isLoadingFragments: boolean = false
  fragments: Fragment[] = []

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private codeService: CodeService,
    private fragmentService: FragmentService,
    private newCategoryDialog: MatDialog
  ) { }

  async ngOnInit() {
    let projId = this.route.snapshot.paramMap.get('projId')
    this.currentProject = await this.projectService.getProjectById(projId)
    this.categories = (await this.categoryService.getCategoriesByIds(this.currentProject.categories))
                            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    this.codes = (await this.codeService.getCodesByIds(this.currentProject.codes))
                            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    this.buildTree()
    console.log(this.treeList)
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

  edit(item: ListItem){
    if (item.type == Code) this.editCode(item.node)
    if (item.type == Category) this.editCategory(item.node)
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

  async openSidenav(item: ListItem) {
    if (item.type == Code && item.node != this.selectedCode) {
      this.selectedCode = item.node
      this.codeDetailsRef.open()
      this.isLoadingFragments = true
      this.fragments = await this.fragmentService.getFragmentsByIds(item.node.fragments)
      this.isLoadingFragments = false
    }
  }

  buildTree() {
    this.treeList = []
    let parentCategories = this.categories.filter(category => !category.parent)
    let parentCodes = this.codes.filter(codes => !codes.parent)
    parentCategories.forEach(category => {
      this.place(category, 0)
    })
    parentCodes.forEach(code => this.treeList.push({
      node: code,
      type: Code,
      level: 0
    }))
  }

  place(category: Category, level: number) {
    this.treeList.push({
      node: category,
      type: Category,
      level: level
    })

    let childCategories = this.categories.filter(cat => cat.parent === category.id)
    childCategories.forEach(cat => {
      this.place(cat, level+1)
    })

    let childCodes = this.codes.filter(code => code.parent === category.id)
    childCodes.forEach(code => this.treeList.push({
      node: code,
      type: Code,
      level: level+1
    }))
  }
}
