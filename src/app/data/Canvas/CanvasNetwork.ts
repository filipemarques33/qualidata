import Structures from '../Structures';
import CanvasCategory from "./CanvasCategory";
import CanvasCode from "./CanvasCode";
import CanvasStage from './CanvasStage';

export default class CanvasNetwork {
  canvasCategories: CanvasCategory[];
  canvasCodes: CanvasCode[];
  quotations: string[];
  visibleRelationships: any[];

  constructor(structures: Structures, canvasStage: CanvasStage) {
    let categoriesMap = new Map<number, {category: CanvasCategory, isRoot: boolean}>();

    this.canvasCodes = structures.codes.map(code => new CanvasCode(canvasStage, code.id, code.name, {
      color: code.color,
      type: structures.codeTypes.find(codeType => codeType.id === code.codeType)
    }));

    structures.categories.forEach(category => {
      let newCategory = new CanvasCategory(canvasStage, category.id, category.name, category.color);
      if (category.codes.size) {
        [...category.codes].forEach(code => {
          let canvasCode = this.canvasCodes.find(canvasCode => canvasCode.id === code);
          newCategory.addCode(canvasCode);
          this.canvasCodes = this.canvasCodes.filter(cCode => cCode.id !== canvasCode.id);
        });
      }
      categoriesMap.set(newCategory.id, {category: newCategory, isRoot: true});
    });

    structures.categories.forEach(category => {
      if (category.categories.size) {
        let canvasCategory = categoriesMap.get(category.id).category;
        category.categories.forEach(categoryId => {
          canvasCategory.addCategory(categoriesMap.get(categoryId).category);
          categoriesMap.get(categoryId).isRoot = false;
        });
      }
    });

    this.canvasCategories = [...categoriesMap].map(([key, categoryRef]) => categoryRef.isRoot ? categoryRef.category : null)
      .filter(canvasCategory => canvasCategory);

    this.quotations = structures.quotations;
    this.visibleRelationships = [];
  }
}