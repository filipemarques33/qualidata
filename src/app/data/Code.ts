import Structure from './Structure';

export default class Code extends Structure {
  constructor(
    id: number,
    name: string,
    color?: string,
    private _codeType?: number,
    private _quotations?: string[]
  ) {
    super(id, name, color);
  }

  get codeType(): number {
    return this._codeType;
  }
}