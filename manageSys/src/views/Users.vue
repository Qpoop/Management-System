<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :model="userQueryForm" :inline="true">
        <el-form-item>
          <el-input v-model="userQueryForm.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="userQueryForm.userName"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="userQueryForm.userState"
            placeholder="请选择用户状态"
          >
            <el-option label="所有" :value="0"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button>查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.props"
          :prop="item.props"
          :label="item.label"
          width="180"
        />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default>
            <el-button text size="small">Detail</el-button>
            <el-button text size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
const userQueryForm = reactive({
  userId: "",
  userName: "",
  userState: 0,
});
const userList = ref([]);
const columns = reactive([
  {
    label: "用户ID",
    props: "userId",
  },
  {
    label: "用户名称",
    props: "userName",
  },
  {
    label: "用户邮箱",
    props: "userEmail",
  },
  {
    label: "用户状态",
    props: "state",
  },
  {
    label: "注册时间",
    props: "createTime",
  },
  {
    label: "最后登录时间",
    props: "lastLoginTime",
  },
]);
</script>

<style scoped lang="less"></style>
