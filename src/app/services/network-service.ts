import { EventEmitter, Injectable } from "@angular/core";
import { Ticker } from "createjs-module";

import CanvasStage from '../data/Canvas/CanvasStage';
import CodeType from '../data/CodeType';
import CanvasCode from '../data/Canvas/CanvasCode';
import Structures from '../data/Structures';
import CanvasNetwork from '../data/Canvas/CanvasNetwork';
import Network from "../data/Network";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  canvasStage: CanvasStage;
  canvas: HTMLCanvasElement;
  structures: Structures = new Structures();
  network: CanvasNetwork;
  detailsCallback: Function;
  edgeCallback: Function;

  structuresUpdated: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  setupCanvasStage(canvasRef: HTMLCanvasElement, detailCallback: Function, edgeCallback: Function) {
    this.detailsCallback = detailCallback;
    this.edgeCallback = edgeCallback;
    this.canvasStage = new CanvasStage(canvasRef);
    this.canvas = canvasRef;
    this.canvasStage.stage.update();

    Ticker.timingMode = Ticker.RAF_SYNCHED;
    Ticker.framerate = 30;

    Ticker.on("tick", () => {
      this.canvasStage?.stage.update();
    });

    this.network = new CanvasNetwork(this.canvasStage, this.detailsCallback);
    // this.network.setupStructures(this.structures);
    // this.network.renderVertex('Category', 1, 400, 100);
    // this.network.renderVertex('Category', 2, 900, 200);
    // this.network.connectVertices(
    //   this.network.canvasCategories.find(category => category.id === 1),
    //   this.network.canvasCategories.find(category => category.id === 2),
    //   this.edgeCallback);
  }

  setupStructures(network: Network) {
    this.structures.clear();
    this.structures.categories = network.categories;
    this.structures.codes = network.codes;
    this.network.setupStructures(this.structures);
    this.structuresUpdated.emit(true);
    // network.categories.forEach(category => {
    //   this.structures.createCategory(category.name, category.color, category.categories, category.codes);
    // });
    // network.codes.forEach(code => {
    //   this.structures.createCode(code.name, code.color, code.codes);
    // })
  }

  redraw() {
    this.canvasStage.redraw();
  }

}