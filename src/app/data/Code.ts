import CanvasStage from './CanvasStage';
import CodeType from './CodeType';
import VertexCategory from './VertexCategory'

export default class Code extends VertexCategory {
  private _codeType: CodeType;
  private _quotations: string[];

  constructor(stage: CanvasStage, name: string, type: CodeType) {
    super(stage.stage, type.name + ': ' + name, 'Code', type.color);
    this._codeType = type;
    this._quotations = [];
  }

  addQuotation(quotation: string) {

  }

  removeQuotation(quotation: string) {

  }

  get type() {
    return this._codeType;
  }
}