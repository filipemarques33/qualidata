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

  clear() {
    this.categories = [];
    this.codes = [];
    this.quotations = [];
    this.codeTypes = [];
  }

  createCategory(name: string, color: string, categories?: Category[], codes?: Code[]) {
    this.categories.push(new Category(name, color, categories, codes));
  }

  createCode(name: string, color: string, codes?: Code[]) {
    this.codes.push(new Code(name, color, codes));
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