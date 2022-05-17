/**
 * axios二次封装
 *
 */
import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const TOKEN_INVALED = "Token认证失败,请重新登录";
const NETWORK_ERROR = "网络请求异常,请稍后重试";

type optionsType = {
  url: string;
  method?: string;
  data?: any;
  params?: any;
  mock?: boolean;
};

const router = useRouter();

const instance = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});

instance.interceptors.request.use((req) => {
  return req;
});

instance.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if (code === 200) {
    return {code,data};
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALED);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
    return Promise.reject(TOKEN_INVALED);
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});

/**
 * 请求核心函数
 * @param options 请求配置
 * @returns
 */
function request(options: optionsType) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  if (typeof options.mock !== "undefined") {
    config.mock = options.mock;
  }

  if (config.env === "prod") {
    instance.defaults.baseURL = config.baseApi;
  } else {
    instance.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
  }

  return instance(options);
}

export default request;
