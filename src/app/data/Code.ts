export default class Code {

  constructor(public name: string, public color: string, public codes: Code[], public position?: {x: number, y: number}) {}

  addCode(code: Code) {
    this.codes.push(code);
  }
}