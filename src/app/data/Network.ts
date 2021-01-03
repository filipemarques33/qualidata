import Code from './Code';
import Category from './Category';
import Relationship from './Relationship';

export default class Network {
  constructor(
    public id: string,
    public categories: string[],
    public codes: string[],
    public relationships: Relationship[],
  ){}
}