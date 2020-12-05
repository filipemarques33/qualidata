import Category from "./Category";
import Code from "./Code";
import CodeType from "./CodeType";

export default class Structures {
  categories: Category[];
  codes: Code[];
  quotations: [];
  codeTypes: CodeType[];

  constructor () {
    this.categories = [];
    this.codes = [];
    this.quotations = [];
    this.codeTypes = [];
  }

  createCategory(id: number, name: string, color: string, categories?: number[], codes?: number[]) {
    this.categories.push(new Category(id, name, color, categories, codes));
  }

  createCode(id:number, name: string, color: string, type?: number) {
    this.codes.push(new Code(id, name, color, type));
  }

  createCodeType(id:number, name: string, color: string) {
    let codeType: CodeType = {
      id: id,
      name: name,
      color: color
    };
    this.codeTypes.push(codeType);
  }

  createQuotation(text: string) {}
}