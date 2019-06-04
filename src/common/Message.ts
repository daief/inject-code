export enum IMSG_TYPE {
  CONTENT_2_BACKGROUND_PAGE_OPEN,
  CONTENT_2_BACKGROUND_PAGE_OPEN_RESP,
}

export class Message<P = any> {
  public type: IMSG_TYPE;
  public data?: P;

  constructor(type: IMSG_TYPE, data?: P) {
    this.type = type;
    this.data = data;
  }
}
