export default class Code {

  constructor(
    public id: string,
    public name: string,
    public color: string,
    public textColor: string,
    public position?: {x: number, y: number}
  ) {}
}