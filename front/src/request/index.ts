// request.ts
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders, // 引入 AxiosRequestHeaders 类型
  AxiosResponse,
  AxiosError,
} from "axios";
import { useAdminStore } from "@/store/modules/useAdminStore";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  headers?: AxiosRequestHeaders; // 使用 AxiosRequestHeaders 作为 headers 的类型
}

interface ResponseData<T = any> {
  code: number;
  data: T;
  message?: string;
}


// 构建统一的处理响应和错误的函数
const to = async <T = any>(
  promise: Promise<AxiosResponse<ResponseData<T>>>
): Promise<[T | null, AxiosError | null]> => {
  try {
    const response = await promise;
    return [response.data.data, null];
  } catch (error) {
    return [null, error as AxiosError];
  }
};

const baseUrl = import.meta.env.VITE_APP_PROXY_URL as string;

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 60 * 1000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const adminStore = useAdminStore();
    const token = adminStore.token;
    if (token && typeof token === 'string') {
      config.headers = {
        ...config.headers,
        'x-token': token,
      };
    }
    // 可在此设置加载指示器
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 根据实际情况，你可能需要对特定的response.status做额外处理
    if (response.data.code !== 0) {
      return Promise.reject(new Error(response.data.message || 'Error'));
    }
    return response; // 直接返回response，保持原始数据结构
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 请求函数，包装了instance调用
export const request = <T = any>(
  config: CustomAxiosRequestConfig
): Promise<[T | null, AxiosError | null]> => {
  // good 不是一个合适的变量名，我们可以改名为configWithDefaults
  const configWithDefaults = {
    method: config.method || 'get', // 默认方法为 GET
    url: config.url,
    headers: config.headers as AxiosRequestHeaders,
    ...config.method === 'get' ? { params: config.params } : { data: config.data },
  };

  // 包装instance调用
  return to<T>(instance(configWithDefaults));
};
