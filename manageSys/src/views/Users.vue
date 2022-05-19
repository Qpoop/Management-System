<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :model="userQueryForm" :inline="true" ref="userQueryFormRef">
        <el-form-item prop="userId">
          <el-input v-model="userQueryForm.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item prop="userName">
          <el-input
            v-model="userQueryForm.userName"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="userQueryForm.state" placeholder="请选择用户状态">
            <el-option label="所有" :value="0"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">查询</el-button>
          <el-button type="danger" @click="handleReset(userQueryFormRef)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAddButton">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.props"
          :prop="item.props"
          :label="item.label"
          :formatter="item.formatter"
          width="150"
        />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button text size="small" @click="handEdit(scope.row)"
              >Edit</el-button
            >
            <el-button text size="small" @click="handleDel([scope.row.userId])"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="pagination"
          v-model:currentPage="pager.pageNum"
          v-model:page-size="pager.pageSize"
          :page-sizes="[5, 10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog v-model="dialogVisible">
      <el-form :model="userForm" ref="userAddFormRef" :rules="userAddFormRule">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            placeholder="请输入用户名称"
            :disabled="action === 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="userForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            placeholder="请选择所属部门"
            v-model="userForm.deptId"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(userAddFormRef)">退出</el-button>
          <el-button type="primary" @click="handleAddUser(userAddFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRaw,
  nextTick,
} from "vue";
import util from "../utils/util";
import { ElMessage } from "element-plus";
const api = getCurrentInstance()?.appContext.config.globalProperties.$api;
const userQueryFormRef = ref();
const userAddFormRef = ref();
const userAddFormRule = reactive({
  userName: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
});
const userQueryForm = reactive({
  userId: "",
  userName: "",
  state: 1,
});
const userList = ref([]);
const roleList = ref([]);
const deptList = ref([]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
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
    label: "用户角色",
    props: "role",
    formatter: (row, column) => {
      return {
        0: "管理员",
        1: "普通用户",
      }[row.role];
    },
  },
  {
    label: "用户状态",
    props: "state",
    formatter: (row, column) => {
      return {
        1: "在职",
        2: "离职",
        3: "试用期",
      }[row.state];
    },
  },
  {
    label: "注册时间",
    props: "createTime",
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value));
    },
  },
  {
    label: "最后登录时间",
    props: "lastLoginTime",
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value));
    },
  },
]);
// 选中的用户id数组
const checkedUserIds = ref([]);
const dialogVisible = ref(false);
const userForm = reactive({});
// 定义用户操作行为
const action = ref("add");

onMounted(() => {
  getUserList();
  getDeptList();
  getRoleList();
});
const getUserList = async () => {
  let params = { ...userQueryForm, ...pager };
  try {
    const { code, data } = await api.getUserList(params);
    const { list, page } = data;
    userList.value = list;
    pager.total = page.total;
  } catch (err) {}
};
const handleQuery = () => {
  getUserList();
};
const handleReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 分页组件方法
const handleCurrentChange = (currentPageNum) => {
  pager.pageNum = currentPageNum;
  getUserList();
};
const handleSizeChange = (currentPageSize) => {
  pager.pageSize = currentPageSize;
  getUserList();
};
// 删除方法
const handleDel = async (userIds) => {
  const { code, data } = await api.deleteUser({
    userIds,
  });
  if (data.modifiedCount > 0) {
    ElMessage.success("删除成功");
    getUserList();
  } else {
    ElMessage.error("删除失败");
  }
};
// 批量删除
const handlePatchDel = () => {
  if (checkedUserIds.value.length === 0) {
    ElMessage.warning("没有选中的用户");
  } else {
    handleDel(checkedUserIds.value);
  }
};
// 用户多选
const handleSelectionChange = (list) => {
  let arr = [];
  list.map((item) => {
    arr.push(item.userId);
  });
  checkedUserIds.value = arr;
  console.log(checkedUserIds.value);
};
// 获取部门和角色列表
const getDeptList = async () => {
  const { code, data } = await api.getDeptList();
  deptList.value = data;
};
const getRoleList = async () => {
  const { code, data } = await api.getRoleList();
  roleList.value = data;
};

const handleAddButton = () => {
  action.value = "add";
  dialogVisible.value = true;
};
const handleClose = (formEl) => {
  dialogVisible.value = false;
  handleReset(formEl);
};
const handleAddUser = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let param = toRaw(userForm);

      param.action = action.value;
      const { code, data } = await api.addUser(param);
      if (code === 200) {
        dialogVisible.value = false;
        if (action.value === "add") {
          ElMessage.success("用户创建成功");
        } else {
          ElMessage.success("修改信息成功");
        }
        handleReset(formEl);
        getUserList();
      }
    } else {
      ElMessage.errorr("信息不完整");
    }
  });
};

const handEdit = (row) => {
  action.value = "edit";
  dialogVisible.value = true;
  nextTick(() => {
    Object.assign(userForm, row);
  });
};
</script>

<style scoped lang="less"></style>
