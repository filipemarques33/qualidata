import Structure from "./Structure";

export default class Category extends Structure {
  private _codes: Set<number>;
  private _categories: Set<number>;

  constructor(
    id: number,
    name: string,
    color: string,
    categories?:  number[],
    codes?: number[],
  ) {
    super(id, name, color);
    this._codes = codes ? new Set(codes) : new Set();
    this._categories = categories ? new Set(categories) : new Set();
  }

  get codes(): Set<number> {
    return this._codes;
  }

  get categories(): Set<number> {
    return this._categories;
  }

  addCode(codeId: number) {
    this._codes.add(codeId);
  }

  addCategory(codeId: number) {
    this._categories.add(codeId);
  }
}