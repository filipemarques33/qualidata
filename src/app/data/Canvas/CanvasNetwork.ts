import Structures from '../Structures';
import CanvasCategory from "./CanvasCategory";
import CanvasCode from "./CanvasCode";
import CanvasStage from './CanvasStage';
import CanvasEdge from './CanvasEdge';
import VertexCategory from './VertexCategory';
import Category from '../Category';

export default class CanvasNetwork {
  private idCounter: number;

  canvasStage: CanvasStage;
  canvasCategories: CanvasCategory[] = [];
  canvasCodes: CanvasCode[] = [];
  quotations: string[];
  visibleRelationships: Map<number, number[]> = new Map();
  visibleVertices: VertexCategory[] = [];
  detailsCallback: Function;

  private vertexMap: Map<number, VertexCategory> = new Map();

  constructor(canvasStage: CanvasStage, detailsCallback: Function) {
    this.canvasStage = canvasStage;
    this.detailsCallback = detailsCallback;
  }

  setupStructures(structures: Structures) {
    this.idCounter = 0;
    this.canvasCategories = structures.categories.map(category => this.createCanvasCategory(category));
    this.canvasCodes = structures.codes.map(code => {
      let canvasCode = new CanvasCode(this.canvasStage, this.idCounter, code.name, {color: code.color}, this.detailsCallback);
      this.vertexMap.set(this.idCounter++, canvasCode);
      if (code.position) {
        canvasCode.renderVertex(code.position.x, code.position.y);
        this.visibleVertices.push(canvasCode);
      }
      return canvasCode;
    });
  }

  renderVertex(id: number, x: number, y: number) {
    let vertex = this.vertexMap.get(id);
    if (vertex && !vertex.isVertexRendered) {
      vertex.renderVertex(x, y);
      this.visibleVertices.push(vertex);
    }
  }

  connectVertices(origin: VertexCategory, destination: VertexCategory, edgeCallback: Function) {
    let edge = new CanvasEdge(this.canvasStage, 'gray', origin, destination, edgeCallback);
    let originRel = this.visibleRelationships.get(origin.id);
    let destRel = this.visibleRelationships.get(destination.id);
    originRel.push(destination.id);
    destRel.push(origin.id);
    edge.renderArc();
  }

  private createCanvasCategory(parentCategory: Category): CanvasCategory {
    let canvasCategory = new CanvasCategory(this.canvasStage, this.idCounter, parentCategory.name, parentCategory.color, this.detailsCallback);
    this.vertexMap.set(this.idCounter++, canvasCategory);
    parentCategory.categories.forEach(category => canvasCategory.addCategory(this.createCanvasCategory(category)));
    parentCategory.codes.forEach(code => {
      let canvasCode = new CanvasCode(
        this.canvasStage,
        this.idCounter,
        code.name,
        {color: code.color},
        this.detailsCallback
      );
      this.vertexMap.set(this.idCounter++, canvasCode);
      if (code.position) {
        canvasCode.renderVertex(code.position.x, code.position.y);
        this.visibleVertices.push(canvasCode);
      }
      canvasCategory.addCode(canvasCode);
    });
    if (parentCategory.position) {
      canvasCategory.renderVertex(parentCategory.position.x, parentCategory.position.y);
      this.visibleVertices.push(canvasCategory);
    }
    return canvasCategory;
  }
}