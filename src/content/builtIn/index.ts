import { functionImplement } from './functionImplement';

const proxy: any = new Proxy(
  {},
  {
    get(_, propKey) {
      return (...argArray: any[]) => functionImplement(propKey, argArray);
    },
  },
);

export default proxy;
