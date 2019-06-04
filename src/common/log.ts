// tslint:disable: no-console
export const Info = (...args: any[]) =>
  console.log('%cINFO', 'color: #19d619;font-size: 16px', ...args);

export const Debug = (...args: any[]) =>
  process.env.NODE_ENV === 'development' &&
  console.log('%cDEBUG', 'color: #e89f26;font-size: 16px', ...args);

export const Log = {
  Info,
  Debug,
};
