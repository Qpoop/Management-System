<template>
  <el-container class="common-container">
    <el-aside width="250px" class="common-left">
      <Aside :menuList="userMenu" />
    </el-aside>
    <el-container class="common-right">
      <el-header class="common-header">Header</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Aside from "comps/Aside.vue";

import {
  onMounted,
  onBeforeMount,
  getCurrentInstance,
  ref,
  reactive,
} from "vue";
import { useUserStore } from "../store/user";

const api = getCurrentInstance()?.appContext.config.globalProperties.$api;
const userStore = useUserStore();

const count = ref(0);
// const state = reactive({
//   userMenu: [],
// });
const userMenu = reactive([]);

onBeforeMount(() => {
  getNoticeCount();
  getUserMenu();
});

const getNoticeCount = async () => {
  const { code, data } = await api.noticeCount();
  count.value = data;
};

const getUserMenu = async () => {
  const { code, data } = await api.getMenuList();
  userMenu.push(...data);
};
</script>

<style scoped lang="less">
.common-container {
  background-color: rgb(236, 238, 237);
  width: 100vw;
  height: 100vh;

  .common-left {
    background-color: #011520;
  }

  .common-right {
    .common-header {
      background-color: #fff;
    }
  }
}
</style>
