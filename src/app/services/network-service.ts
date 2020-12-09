import { Injectable } from "@angular/core";
import { Ticker } from "createjs-module";

import CanvasStage from '../data/Canvas/CanvasStage';
import CodeType from '../data/CodeType';
import CanvasCode from '../data/Canvas/CanvasCode';
import Structures from '../data/Structures';
import CanvasNetwork from '../data/Canvas/CanvasNetwork';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  canvasStage: CanvasStage;
  canvas: HTMLCanvasElement;
  structures: Structures = new Structures();
  network: CanvasNetwork;

  constructor() {
    this.setupStructures();
  }

  setupCanvasStage(canvasRef: HTMLCanvasElement) {
    this.canvasStage = new CanvasStage(canvasRef);
    this.canvas = canvasRef;
    this.canvasStage.stage.update();

    Ticker.on("tick", () => {
      this.canvasStage?.stage.update();
    });

    this.network = new CanvasNetwork(this.structures, this.canvasStage);

    const codeType: CodeType = {id: -1, name: 'Type 1', color: 'red'};
    const code = new CanvasCode(this.canvasStage, -1, 'Code 1', {type: codeType});
    code.renderVertex(500, 500);
  }

  setupStructures() {
    this.structures.createCategory(1, 'Category 1', 'red', [5], [6, 7, 8, 9]);
    this.structures.createCategory(2, 'Category 2', 'yellow');
    this.structures.createCategory(3, 'Category 3', 'brown');
    this.structures.createCategory(4, 'Category 4', 'black');
    this.structures.createCategory(5, 'Category 5', 'red', [6], [11]);
    this.structures.createCategory(6, 'Category 6', 'black', [7]);
    this.structures.createCategory(7, 'Category 7', 'black', [8]);
    this.structures.createCategory(8, 'Category 8', 'black');

    this.structures.createCodeType(12, 'Type 1', 'black');

    this.structures.createCode(6, 'Node 1', 'red', 12);
    this.structures.createCode(7, 'Node 2', 'red');
    this.structures.createCode(8, 'Node 3', 'red');
    this.structures.createCode(9, 'Node 4', 'red');
    this.structures.createCode(10, 'Node 5', 'blue');
    this.structures.createCode(11, 'Node 6', 'blue');
  }

  redraw() {
    this.canvasStage.redraw();
  }

}