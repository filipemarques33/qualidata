import { Injectable } from "@angular/core";

import Category from "../data/Category";
import Code from "../data/Code"

import { DatabaseService } from "./database-service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  getParentcategories(categories: Category[]){
    return categories.filter(category => category.parent == null)
  }

  getChildCategories(categories: Category[], parentId:string){
    return categories.filter(category => category.parent == parentId)
  }

}
