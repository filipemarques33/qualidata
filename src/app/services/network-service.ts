import { EventEmitter, Injectable } from "@angular/core";
import { Ticker } from "createjs-module";

import CanvasStage from '../data/Canvas/CanvasStage';
import CanvasNetwork, { ConnectionOptions } from '../data/Canvas/CanvasNetwork';
import Network from "../data/Network";
import CanvasCategory from "../data/Canvas/CanvasCategory";
import VertexCategory from "../data/Canvas/VertexCategory";
import { DatabaseService } from "./database-service";
import Category from "../data/Category";
import Code from "../data/Code";
import Relationship from "../data/Relationship";
import CanvasEdge from "../data/Canvas/CanvasEdge";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private canvasStage: CanvasStage;
  private network: CanvasNetwork;
  private networkId: string;
  private detailsCallback: Function;
  private edgeCallback: Function;

  public structuresUpdated: EventEmitter<boolean> = new EventEmitter();

  constructor(private databaseService: DatabaseService) {
  }

  get canvasCategories() {
    return this.network.canvasCategories;
  }

  get canvasCodes() {
    return this.network.canvasCodes;
  }

  get visibleRelationships() {
    return this.network.visibleRelationships;
  }

  get visibleVertices() {
    return this.network.visibleVertices;
  }

  setupCanvasStage(canvasRef: HTMLCanvasElement, detailCallback: Function, edgeCallback: Function) {
    this.detailsCallback = detailCallback;
    this.edgeCallback = edgeCallback;
    this.canvasStage = new CanvasStage(canvasRef);
    this.canvasStage.stage.update();

    Ticker.timingMode = Ticker.RAF_SYNCHED;
    Ticker.framerate = 60;

    Ticker.on("tick", () => {
      this.canvasStage?.stage.update();
    });

    this.network = new CanvasNetwork(this.canvasStage, this.detailsCallback, this.edgeCallback);
  }

  setupStructures(network: Network, categories: Category[], codes: Code[]) {
    this.networkId = network.id;
    this.network.setupStructures(network, categories, codes);
    this.structuresUpdated.emit(true);
  }

  removeVertex(vertex: VertexCategory) {
    this.network.unrenderVertex(vertex);
  }

  redraw() {
    this.canvasStage.redraw();
  }

  getVertexById(id: string) {
    return this.network.getVertexById(id);
  }

  renderVertex(id: string, x: number, y: number) {
    this.network.renderVertex(id, x, y);
  }

  connectVertices(origin: VertexCategory, destination: VertexCategory, options?: ConnectionOptions) {
    this.network.connectVertices(origin, destination, options);
  }

  async saveChanges() {
    let updateCategories = [];
    let updateCodes = [];
    let updateRelationships: Relationship[];
    let uniqueRelationships: CanvasEdge[] = [];
    this.network.visibleVertices.forEach(vertex => {
      if (vertex instanceof CanvasCategory) {
        updateCategories.push({id: vertex.id, position: {x: vertex.vertex.x, y: vertex.vertex.y}});
      } else {
        updateCodes.push({id: vertex.id, position: {x: vertex.vertex.x, y: vertex.vertex.y}});
      }
    });
    this.network.deletedVertices.forEach(vertex => {
      if (vertex instanceof CanvasCategory) {
        updateCategories.push({id: vertex.id, position: null});
      } else {
        updateCodes.push({id: vertex.id, position: null});
      }
    });
    [...this.network.visibleRelationships].forEach(([vertexId, relationships]) => {
      uniqueRelationships.push(...relationships.filter(relationship => relationship.fromVertex.id === vertexId));
    });
    updateRelationships = uniqueRelationships.map(relationship => ({
      title: relationship.title,
      from: relationship.fromVertex.id,
      to: relationship.toVertex.id,
      arrowFrom: relationship.arrowFrom,
      arrowTo: relationship.arrowTo,
      edgeType: relationship.edgeType
    }));
    if (updateCategories.length) await this.databaseService.updateCategoriesPositions(updateCategories);
    if (updateCodes.length) await this.databaseService.updateCodesPositions(updateCodes);
    console.log(updateRelationships);
    if (updateRelationships) await this.databaseService.updateRelationships(this.networkId, updateRelationships);
  }

}