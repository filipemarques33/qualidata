import Structures from '../Structures';
import CanvasCategory from "./CanvasCategory";
import CanvasCode from "./CanvasCode";
import CanvasStage from './CanvasStage';
import CanvasEdge from './CanvasEdge';
import VertexCategory from './VertexCategory';

export default class CanvasNetwork {
  private codes: CanvasCode[];
  private categories: CanvasCategory[];

  canvasStage: CanvasStage;
  canvasCategories: CanvasCategory[] = [];
  canvasCodes: CanvasCode[] = [];
  quotations: string[];
  visibleRelationships: any[];
  visibleVertices: VertexCategory[] = [];

  private typeMap: {[key: string]: (id: number) => VertexCategory} = {
    'Code': (id: number) => this.findCanvasCode(id),
    'Category': (id: number) => this.findCanvasCategory(id)
  };

  constructor(structures: Structures, canvasStage: CanvasStage, detailsCallback: Function) {
    let categoriesMap = new Map<number, {category: CanvasCategory, isRoot: boolean}>();
    this.canvasStage = canvasStage;

    this.codes = structures.codes.map(code => new CanvasCode(this.canvasStage, code.id, code.name, {
      color: code.color,
      type: structures.codeTypes.find(codeType => codeType.id === code.codeType)
    }, detailsCallback));

    this.canvasCodes = this.codes.slice(0);

    this.categories = [];

    structures.categories.forEach(category => {
      let newCategory = new CanvasCategory(this.canvasStage, category.id, category.name, category.color, detailsCallback);
      if (category.codes.size) {
        [...category.codes].forEach(code => {
          let canvasCode = this.canvasCodes.find(canvasCode => canvasCode.id === code);
          newCategory.addCode(canvasCode);
          this.canvasCodes = this.canvasCodes.filter(cCode => cCode.id !== canvasCode.id);
        });
      }
      this.categories.push(newCategory);
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

  renderVertex(type: string, id: number, x: number, y: number) {
    let vertex = this.typeMap[type](id);
    if (vertex && !vertex.isVertexRendered) {
      vertex.renderVertex(x, y);
      this.visibleVertices.push(vertex);
    }
  }

  connectVertices(origin: VertexCategory, destination: VertexCategory) {
    let edge = new CanvasEdge(this.canvasStage, 'black', origin.vertex, destination.vertex);
    edge.renderArcAtBeggining();
  }

  private findCanvasCode(id: number) {
    return this.codes.find(vertex => vertex.id === id);
  }

  private findCanvasCategory(id: number) {
    return this.categories.find(vertex => vertex.id === id);
  }
}