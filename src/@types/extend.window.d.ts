import { AxiosPromise, AxiosRequestConfig, AxiosStatic } from 'axios';

declare global {
  interface Window {
    InjectCode: {
      axiosGet: AxiosStatic['get'];
      axiosPost: AxiosStatic['post'];
      axiosGetUri: AxiosStatic['getUri'];
      // methods from content
      injectJS(code: string): void;

      // methods from background
      axios<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
      axios<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    };
  }
}
