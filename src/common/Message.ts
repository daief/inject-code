// tslint:disable max-classes-per-file
export enum IMSG_TYPE {
  CONTENT_2_BACKGROUND_PAGE_OPEN,
  CONTENT_2_BACKGROUND_PAGE_OPEN_RESP,

  CONTENT_2_BACKGROUND_CALL_METHOD,
  CONTENT_2_BACKGROUND_CALL_METHOD_RESP,
}

export class Message<P = any> {
  public type: IMSG_TYPE;
  public data?: P;

  constructor(type: IMSG_TYPE, data?: P) {
    this.type = type;
    this.data = data;
  }
}

export class CallBackParam<R = any, E = any> {
  public result: R | undefined;
  public error: E | undefined;

  constructor(result: R, error: E) {
    this.result = result;
    this.error = error;
  }
}
