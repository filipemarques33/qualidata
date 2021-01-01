export default class File {
  constructor(
    private _id: number,
    private _title: string,
    private _content: string,
  ) {}

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

}
