export default class Filter {
  whereParams: Record<string, any>;

  constructor(whereParams: Record<string, any>) {
    this.whereParams = whereParams;
  }
}
