import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { environment } from "../../environment";
import { InterceptorService } from "../../utils/InterceptorService";

export const AXIOS_INSTANCE = Axios.create({ baseURL: environment.BASE_API });
const interceptorService = new InterceptorService(AXIOS_INSTANCE);
interceptorService.addRequestInterceptor().addResponseInterceptor();

export const baseInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export default baseInstance;

export interface ErrorType<Error> extends AxiosError<Error> {}
