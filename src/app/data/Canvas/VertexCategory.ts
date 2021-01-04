import Vertex from "./Vertex";
import * as createjs from 'createjs-module'

export default class VertexCategory {
  private _id: string;
  private _color: string;
  private _name: string;
  private _stage: createjs.Stage;
  private _vertex: Vertex;
  private _isRendered: boolean;
  private _type: string;
  private _detailsCallback: Function;

  constructor(stage: createjs.Stage, id: string, name: string, type: string, color: string = 'white', detailsCallback: Function) {
    this._id = id;
    this._color = color;
    this._name = name;
    this._stage = stage;
    this._type = type;
    this._isRendered = false;
    this._detailsCallback = detailsCallback;
    this._vertex = new Vertex(this._name, this._color, this._type, (event) => this._detailsCallback(event, this));
    this._vertex.name = `vertex${Math.random()*100000}`
    this._vertex.visible = false;
  }

  get id() {
    return this._id;
  }

  get isVertexRendered() {
    return this._isRendered;
  }

  get vertex() {
    return this._vertex;
  }

  get name() {
    return this._name;
  }

  get color() {
    return this._color;
  }

  renderVertex(x: number, y: number) {
    if (!this._stage.contains(this._vertex)) {
      this._vertex.x = x;
      this._vertex.y = y;
      this._vertex.visible = true;
      this._stage.addChild(this._vertex);
      this._isRendered = true;
    }
  }

  makeVertexInvisible() {
    this._vertex.visible = false;
    this._isRendered = false;
  }

  unrenderVertex() {
    this._stage.removeChild(this._vertex);
    this._vertex.visible = false;
    this._isRendered = false;
  }
}