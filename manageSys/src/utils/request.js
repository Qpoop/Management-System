/**
 * axios二次封装
 *
 */
import axios from "axios";
import config from "../config";
import storage from "./storage";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const TOKEN_INVALED = "Token认证失败,请重新登录";
const NETWORK_ERROR = "网络请求异常,请稍后重试";

const router = useRouter();

const instance = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});

instance.interceptors.request.use((req) => {
  const localStroage = storage.getItem("userInfo");
  if (localStroage) {
    req.headers.Authorization = "Bearer " + localStroage.token;
  }
  return req;
});

instance.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if (code === 200) {
    return { code, data };
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALED);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
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
function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }

  if (config.env === "prod") {
    instance.defaults.baseURL = config.baseApi;
  } else {
    instance.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }

  return instance(options);
}

export default request;
