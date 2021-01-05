import CanvasCategory from "./CanvasCategory";
import CanvasCode from "./CanvasCode";
import CanvasStage from './CanvasStage';
import CanvasEdge from './CanvasEdge';
import VertexCategory from './VertexCategory';
import Category from '../Category';
import Code from '../Code';
import Network from '../Network';

export interface ConnectionOptions {
  title?: string;
  comment?: string;
  color?: string;
  edgeType?: string;
  arrowFrom?: boolean;
  arrowTo?: boolean;
}

export default class CanvasNetwork {
  canvasStage: CanvasStage;
  canvasCategories: CanvasCategory[] = [];
  canvasCodes: CanvasCode[] = [];
  quotations: string[];

  codes: Map<string, Code> = new Map();
  categories: Map<string, Category> = new Map();

  private vertexMap: Map<string, VertexCategory> = new Map();
  visibleRelationships: Map<string, CanvasEdge[]> = new Map();
  visibleVertices: VertexCategory[] = [];
  deletedVertices: VertexCategory[] = [];
  detailsCallback: Function;
  edgeCallback: Function;

  constructor(canvasStage: CanvasStage, detailsCallback: Function, edgeCallback: Function) {
    this.canvasStage = canvasStage;
    this.detailsCallback = detailsCallback;
    this.edgeCallback = edgeCallback;
  }

  setupStructures(network: Network, categories: Category[], codes: Code[]) {
    this.visibleVertices = [];
    this.visibleRelationships = new Map();
    this.canvasCategories = categories.map(category => {
      let canvasCategory = new CanvasCategory(this.canvasStage, category.id, category.name, category.color, this.detailsCallback);
      canvasCategory.categories = category.categories;
      canvasCategory.codes = category.codes;
      this.vertexMap.set(category.id, canvasCategory);
      this.categories.set(category.id, category);
      this.visibleRelationships.set(category.id, []);
      if (category.position) {
        canvasCategory.renderVertex(category.position.x, category.position.y);
        this.visibleVertices.push(canvasCategory);
      }
      return canvasCategory;
    });
    this.canvasCodes = codes.map(code => {
      let canvasCode = new CanvasCode(this.canvasStage, code.id, code.name, {color: code.color}, this.detailsCallback);
      this.vertexMap.set(code.id, canvasCode);
      this.codes.set(code.id, code);
      this.visibleRelationships.set(code.id, []);
      if (code.position) {
        canvasCode.renderVertex(code.position.x, code.position.y);
        this.visibleVertices.push(canvasCode);
      }
      return canvasCode;
    });
    network.relationships.forEach(relationship => {
      let fromVertex = this.vertexMap.get(relationship.from);
      let toVertex = this.vertexMap.get(relationship.to);
      this.connectVertices(fromVertex, toVertex, {
        title: relationship.title,
        comment: relationship.comment,
        color: relationship.color,
        edgeType: relationship.edgeType,
        arrowFrom: relationship.arrowFrom,
        arrowTo: relationship.arrowTo
      });
    })
  }

  renderVertex(id: string, x: number, y: number) {
    let vertex = this.vertexMap.get(id);
    if (vertex && !vertex.isVertexRendered) {
      vertex.renderVertex(x, y);
      this.deletedVertices = this.deletedVertices.filter(vertex => vertex.id !== id);
      this.visibleVertices.push(vertex);
      this.visibleRelationships.set(id, []);
    }
  }

  unrenderVertex(vertex: VertexCategory) {
    let edges = this.visibleRelationships.get(vertex.id);
    this.visibleRelationships.get(vertex.id).forEach(relationship => {
      let differentId = relationship.fromVertex.id === vertex.id ? relationship.toVertex.id : relationship.fromVertex.id;
      this.visibleRelationships.set(differentId,
        this.visibleRelationships.get(differentId)
          .filter(rel => rel.fromVertex.id !== vertex.id && rel.toVertex.id !== vertex.id)
      );
    });
    this.visibleRelationships.delete(vertex.id);
    edges.forEach(edge => edge.unrenderArc());
    this.visibleVertices = this.visibleVertices.filter(visibleVertex => visibleVertex.id !== vertex.id);
    if (vertex instanceof CanvasCategory) {
      let category = this.categories.get(vertex.id);
      category.position = null;
    } else {
      let code = this.codes.get(vertex.id);
      code.position = null;
    }
    this.deletedVertices.push(vertex);
    vertex.unrenderVertex();
  }

  connectVertices(origin: VertexCategory, destination: VertexCategory, options?: ConnectionOptions) {
    let edge = new CanvasEdge(this.canvasStage, options.color ? options.color : 'gray', origin, destination, this.edgeCallback);
    if (options) {
      edge.comment = options.comment;
      edge.title = options.title != null ? options.title : edge.title;
      edge.edgeType = options.edgeType != null ? options.edgeType : edge.edgeType;
      edge.arrowFrom = options.arrowFrom != null ? options.arrowFrom : edge.arrowFrom;
      edge.arrowTo = options.arrowTo != null ? options.arrowTo : edge.arrowTo;
    }
    let originRelationships = this.visibleRelationships.get(origin.id);
    let destRelationships = this.visibleRelationships.get(destination.id);
    originRelationships.push(edge);
    destRelationships.push(edge);
    edge.renderArcAtBeggining();
  }

  getVertexById(id: string) {
    return this.vertexMap.get(id);
  }
}