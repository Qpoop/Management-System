/**
 * Api管理
 */
import request from "../utils/request";
export default {
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
    });
  },
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: true,
    });
  },
  getMenuList(params) {
    return request({
      url: "/menu/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  getUserList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  deleteUser(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: false,
    });
  },
  getAllRoleList() {
    return request({
      url: "/roles/allList",
      method: "get",
      data: {},
      mock: false,
    });
  },
  getDeptList() {
    return request({
      url: "/dept/list",
      method: "get",
      data: {},
      mock: true,
    });
  },
  getRoleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  addUser(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  addMenu(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  addRole(params) {
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  updatePermission(params) {
    return request({
      url: "/roles/update/permission",
      method: "post",
      data: params,
      mock: false,
    });
  },
};
