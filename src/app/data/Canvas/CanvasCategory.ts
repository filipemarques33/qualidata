import CanvasStage from './CanvasStage';
import CanvasCode from './CanvasCode';
import VertexCategory from './VertexCategory'

export default class CanvasCategory extends VertexCategory {
  codes: CanvasCode[];
  categories: CanvasCategory[];

  constructor(stage: CanvasStage, id: number, name: string, color: string, detailsCallback: Function) {
    super(stage.stage, id, name, 'Category', color, detailsCallback);
    this.codes = [];
    this.categories = [];
  }

  addCode(code: CanvasCode) {
    this.codes.push(code);
  }

  removeCode(code: CanvasCode) {
    this.codes = this.codes.filter(existingCode => code.id === existingCode.id);
  }

  addCategory(category: CanvasCategory) {
    this.categories.push(category);
  }

  removeCategory(category: CanvasCategory) {
    this.categories = this.categories.filter(existingCategory => category.id === existingCategory.id);
  }
}