import * as createjs from 'createjs-module'
import CanvasStage from './CanvasStage';
import Vertex from './Vertex';

export default class Edge {
  private _stage: CanvasStage;
  private _color: string;
  private _fromVertex: Vertex;
  private _toVertex: Vertex;
  private _fromVertexText: createjs.Text;
  private _toVertexText: createjs.Text;
  private _dash: number;
  private _arc: createjs.Shape;
  private arrowTo: boolean;
  private arrowFrom: boolean;
  private divisionFrom: number;
  private divisionTo: number;

  constructor(stage: CanvasStage, color: string, fromVertex: Vertex, toVertex: Vertex) {
    this._stage = stage;
    this._color = color;
    this._fromVertex = fromVertex;
    this._toVertex = toVertex;
    this._fromVertexText = (fromVertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this._toVertexText = (toVertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this._dash = 0;
    this._arc = new createjs.Shape();
    this._arc.cursor = 'pointer';
    this._arc.visible = false;
    this.arrowFrom = true;
    this.arrowTo = false;
    this.divisionFrom = 1.5;
    this.divisionTo = 1.7;

    this._arc.on('tick', () => {
      if (this._arc.visible) {
        // this._dash = (this._dash+1)%20;
        const pt1 = this._fromVertexText.localToGlobal(this._fromVertexText.x, this._fromVertexText.y);
        const pt2 = this._toVertexText.localToGlobal(this._toVertexText.x, this._toVertexText.y);

        pt1.x -= this._fromVertexText.x;
        pt1.y -= this._fromVertexText.y;
        pt2.x -= this._toVertexText.x;
        pt2.y -= this._toVertexText.y;

        let deltaY = pt1.y - pt2.y;
        let deltaX = pt1.x - pt2.x;
        let absAngle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX));
        let angle = Math.atan2(deltaY, deltaX);

        let {toVertexDiff, fromVertexDiff} = this.getShapeDiff(absAngle, angle);
        let fromX = pt1.x - fromVertexDiff.x;
        let fromY = pt1.y - fromVertexDiff.y;

        let toX = pt2.x - toVertexDiff.x;
        let toY = pt2.y - toVertexDiff.y;


        this._arc.graphics.clear().setStrokeStyle(4)
          // .beginStroke('black').moveTo(pt1.x, pt1.y).lineTo(pt2.x, pt2.y)
          .beginStroke(this._color).moveTo(fromX, fromY).lineTo(toX, toY);
        if (this.arrowFrom) this._arc.graphics.beginFill(this._color).drawPolyStar(fromX, fromY, 5, 3, 0.5, angle*(180/Math.PI));
        if (this.arrowTo) this._arc.graphics.beginFill(this._color).drawPolyStar(toX, toY, 5, 3, 0.5, angle*(180/Math.PI) + 180);
      }
    });

    this._arc.on('click', () => console.log('hello'))
  }

  getShapeDiff(absAngle: number, angle: number) {
    let toVertexDiff = {
      x: 0,
      y: 0,
      arrowX: 0,
      arrowY: 0
    };
    let fromVertexDiff = {
      x: 0,
      y: 0,
      arrowX: 0,
      arrowY: 0
    }

    let degree = angle*(180/Math.PI);
    let isOnLeftOrRight = Math.tan(absAngle)*this._toVertex.width < this._toVertex.height ? 1 : 0;

    let xSign = Math.abs(degree) < 90 ? -1 : 1;
    let ySign = (-degree/Math.abs(degree));
    if (isOnLeftOrRight) {
      toVertexDiff.x = this._toVertex.width/this.divisionTo*xSign;
      // toVertexDiff.arrowX = this._toVertex.width/this.division*xSign;
      toVertexDiff.y = Math.tan(absAngle)*this._toVertex.width/this.divisionTo*ySign;
      // toVertexDiff.arrowY = Math.tan(absAngle)*this._toVertex.width/this.division*ySign;

      fromVertexDiff.x = this._fromVertex.width/this.divisionFrom*(-xSign);
      fromVertexDiff.y = Math.tan(absAngle)*this._fromVertex.width/this.divisionFrom*(-ySign);
    } else {
      toVertexDiff.x = this._toVertex.height/this.divisionTo/Math.tan(absAngle)*xSign;
      toVertexDiff.y = this._toVertex.height/this.divisionTo*ySign;
      // arrowDiffX = this._toVertex.height/this.division/Math.tan(absAngle)*xSign;
      // arrowDiffY = this._toVertex.height/this.division*ySign;
      fromVertexDiff.x = this._fromVertex.height/this.divisionFrom/Math.tan(absAngle)*(-xSign);
      fromVertexDiff.y = this._fromVertex.height/this.divisionFrom*(-ySign);
    }

    return {toVertexDiff, fromVertexDiff};
  }

  renderArc() {
    this._stage.addChild(this._arc);
    this._arc.visible = true;
  }

  renderArcAtBeggining() {
    this._stage.addChildAtBeggining(this._arc);
    this._arc.visible = true;
  }

  makeArcInvisible() {
    this._arc.visible = false;
  }

  unrenderArc() {
    this._stage.removeChild(this._arc);
    this._arc.visible = false;
  }
}