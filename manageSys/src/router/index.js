import { createRouter, createWebHashHistory } from "vue-router";

const Home = () => import("views/Home.vue");
const Welcome = () => import("comps/Welcome.vue");
const Login = () => import("views/Login.vue");
const Users = () => import("views/Users.vue");

const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    redirect: { name: "welcome" },
    children: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "欢迎页",
        },
        component: Welcome,
      },
      {
        name: "user",
        path: "/system/user",
        meta: {
          title: "用户管理页",
        },
        component: Users,
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录页",
    },
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
