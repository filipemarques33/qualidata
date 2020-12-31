import Code from "./Code";

export default class Category {
  constructor(public name: string, public color: string, public categories?:  Category[], public codes?: Code[], public position?: {x: number, y: number}) {
  }

  addCode(code: Code) {
    this.codes.push(code);
  }

  addCategory(category: Category) {
    this.categories.push(category);
  }
}