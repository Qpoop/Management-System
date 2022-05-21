<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :model="roleQueryForm" :inline="true" ref="roleQueryFormRef">
        <el-form-item prop="roleName">
          <el-input
            v-model="roleQueryForm.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="getRoleList()">查询</el-button>
          <el-button type="danger" @click="handleReset(menuQueryFormRef)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" stripe>
        <el-table-column
          v-for="item in columns"
          :key="item.props"
          :prop="item.props"
          :label="item.label"
          :formatter="item.formatter"
          width="200"
        />
        <el-table-column fixed="right" label="操作" width="260">
          <template #default="scope">
            <el-button text size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button text size="small" @click="handleSet(scope.row)"
              >设置</el-button
            >
            <el-button text si ze="small" @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 添加/编辑的弹窗 -->
    <el-dialog v-model="dialogVisible" @close="handleReset(roleAddFormRef)">
      <el-form :model="roleForm" ref="roleAddFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :row="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(roleAddFormRef)">退出</el-button>
          <el-button type="primary" @click="handleAddRole(roleAddFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 设置权限的弹窗 -->
    <el-dialog v-model="setDialogVisible" @close="handleReset(roleSetFormRef)">
      <el-form :model="roleForm" ref="roleAddFormRef">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTreeRef"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(roleSetFormRef)">退出</el-button>
          <el-button type="primary" @click="handleAddPermission(roleSetFormRef)"
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

const roleQueryForm = reactive({
  roleName: "",
});
const roleQueryFormRef = ref();
const handleReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const columns = reactive([
  {
    label: "角色名称",
    props: "roleName",
    width: 180,
  },
  {
    label: "备注",
    props: "remark",
  },
  {
    label: "权限列表",
    props: "permissionList",
    formatter: (row, column, value) => {
      let names = [];
      let list = value.halfCheckedKeys || [];
      list.map((key) => {
        let name = actionMap[key];
        if (key && name) names.push(name);
      });
      return names.join(",");
    },
  },
  {
    label: "创建时间",
    props: "createTime",
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value));
    },
  },
  {
    label: "更新时间",
    props: "updateTime",
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value));
    },
  },
]);
const roleList = ref([]);
const handleEdit = (row) => {
  dialogVisible.value = true;
  action.value = "edit";
  let role = { _id: row._id, roleName: row.roleName, remark: row.remark };
  nextTick(() => {
    Object.assign(roleForm, role);
  });
};
const handleDel = async (_id) => {
  await api.addRole({ _id, action: "delete" });
  ElMessage.success("删除成功");
  getRoleList();
};

// 新增功能
const action = ref("create");
const roleForm = reactive({});
const roleAddFormRef = ref();
const dialogVisible = ref(false);
const handleAdd = (type, row) => {
  dialogVisible.value = true;
  action.value = "create";
};
const handleClose = (formEl) => {
  dialogVisible.value = false;
  setDialogVisible.value = false;
  handleReset(formEl);
};
const handleAddRole = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let param = toRaw(roleForm);
      param.action = action.value;
      // let params = { ...param, ...pager };
      let res = await api.addRole(param);
      dialogVisible.value = false;
      ElMessage.success("添加成功");
      handleReset(formEl);
      getRoleList();
    } else {
      ElMessage.errorr("信息不完整");
    }
  });
};
// 分页
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
const handleCurrentChange = (currentPageNum) => {
  pager.pageNum = currentPageNum;
  getRoleList();
};
const handleSizeChange = (currentPageSize) => {
  pager.pageSize = currentPageSize;
  getRoleList();
};
// 设置权限的弹窗
const menuList = ref([]);
const curRoleName = ref("");
const curRoleId = ref("");
const setDialogVisible = ref(false);
const handleAddPermission = async (formEl) => {
  let nodes = permissionTreeRef.value.getCheckedNodes();
  let halfKeys = permissionTreeRef.value.getHalfCheckedKeys();
  let checkedKeys = [];
  let parentKeys = [];
  nodes.map((node) => {
    if (!node.children) {
      checkedKeys.push(node._id);
    } else {
      parentKeys.push(node._id);
    }
  });
  let params = {
    _id: curRoleId.value,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: parentKeys.concat(halfKeys),
    },
  };
  await api.updatePermission(params);
  setDialogVisible.value = false;
  ElMessage.success("设置权限成功");
  getRoleList();
};
const permissionTreeRef = ref();
//菜单映射表
const actionMap = reactive({});
const handleSet = (row) => {
  curRoleId.value = row._id;
  curRoleName.value = row.roleName;
  setDialogVisible.value = true;
  let { checkedKeys } = row.permissionList;
  nextTick(() => {
    permissionTreeRef.value.setCheckedKeys(checkedKeys);
  });
};
const getActionMap = (list) => {
  let actionMap_temp = {};
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop();
      if (item.children && item.action) {
        actionMap_temp[item._id] = item.menuName;
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
    Object.assign(actionMap, actionMap_temp);
    console.log("actionMap", actionMap);
  };
  deep(list);
};

const getRoleList = async () => {
  try {
    // let params = { ...menuQueryForm };
    const { code, data } = await api.getRoleList({
      ...roleQueryForm,
      ...pager,
    });
    const { list, page } = data;
    roleList.value = list;
    pager.total = page.total;
  } catch (error) {
    throw new Error(error);
  }
};
const getMenuList = async () => {
  try {
    const { code, data } = await api.getMenuList();
    menuList.value = data;
    getActionMap(JSON.parse(JSON.stringify(data)));
  } catch (error) {
    throw new Error(error);
  }
};
onMounted(() => {
  getRoleList();
  getMenuList();
});
</script>

<style scoped lang="less"></style>
