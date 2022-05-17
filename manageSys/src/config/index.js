/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  test: {
    baseApi: "/",
    mockApi:
      "https://www.fastmock.site/mock/3659996fb2ac6cf27ae889a192f6e033/api",
  },
  prod: {
    baseApi: "/",
    mockApi:
      "https://www.fastmock.site/mock/3659996fb2ac6cf27ae889a192f6e033/api",
  },
};
export default {
  env,
  mock: false,
  namespace: "manager",
  ...EnvConfig[env],
};
