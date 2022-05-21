<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :model="menuQueryForm" :inline="true" ref="menuQueryFormRef">
        <el-form-item prop="menuName">
          <el-input
            v-model="menuQueryForm.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item prop="menuState">
          <el-select
            v-model="menuQueryForm.menuState"
            placeholder="请选择菜单状态"
          >
            <el-option label="正常" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getMenuList()">查询</el-button>
          <el-button type="danger" @click="handleReset(menuQueryFormRef)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table
        :data="menuList"
        style="width: 100%"
        stripe
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
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
            <el-button text size="small" @click="handleAdd(2, scope.row)"
              >新增</el-button
            >
            <el-button text size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button text size="small" @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" @close="handleReset(menuAddFormRef)">
      <el-form :model="menuForm" ref="menuAddFormRef">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选,则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType === 1"
        >
          <el-input
            v-model="menuForm.icon"
            placeholder="请输入菜单图标"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType === 1"
        >
          <el-input
            v-model="menuForm.path"
            placeholder="请输入路由地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType === 2"
        >
          <el-input
            v-model="menuForm.menuCode"
            placeholder="请输入权限标识"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType === 1"
        >
          <el-input
            v-model="menuForm.component"
            placeholder="请输入组件路径"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="menuForm.menuType === 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(menuAddFormRef)">退出</el-button>
          <el-button type="primary" @click="handleAddMenu(menuAddFormRef)"
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

const menuQueryForm = reactive({
  menuName: "",
  menuState: 1,
});
const menuQueryFormRef = ref();
const handleReset = (formEl) => {
  console.log("111");
  if (!formEl) return;
  formEl.resetFields();
};

const columns = reactive([
  {
    label: "菜单名称",
    props: "menuName",
    width: 180,
  },
  {
    label: "图标",
    props: "icon",
  },
  {
    label: "菜单类型",
    props: "menuType",
    formatter: (row, column, value) => {
      return {
        1: "菜单",
        2: "按钮",
      }[value];
    },
  },
  {
    label: "权限标识",
    props: "menuCode",
  },
  {
    label: "路由地址",
    props: "path",
  },
  {
    label: "组件路径",
    props: "component",
  },
  {
    label: "菜单状态",
    props: "menuState",
    formatter: (row, column, value) => {
      return {
        1: "正常",
        2: "停用",
      }[value];
    },
  },
  {
    label: "创建事件",
    props: "createTime",
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value));
    },
  },
]);
const menuList = ref([]);
const handleEdit = (row) => {
  dialogVisible.value = true;
  action.value = "edit";
  nextTick(() => {
    Object.assign(menuForm, row);
  });
};
const handleDel = async (_id) => {
  await api.addMenu({ _id, action: "delete" });
  ElMessage.success("删除成功");
  getMenuList();
};

// 新增功能
const action = ref("");
const menuForm = reactive({
  parentId: [null],
  menuType: 1,
  menuState: 1,
});
const menuAddFormRef = ref();
const dialogVisible = ref(false);
const handleAdd = (type, row) => {
  dialogVisible.value = true;
  action.value = "add";
  if (type === 2) {
    menuForm.parentId = [...row.parentId, row._id].filter((item) => item);
  }
};
const handleClose = (formEl) => {
  dialogVisible.value = false;
  handleReset(formEl);
};
const handleAddMenu = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let params = toRaw(menuForm);
      params.action = action.value;
      delete params.children;
      let res = await api.addMenu(params);
      dialogVisible.value = false;
      ElMessage.success("添加成功");
      handleReset(formEl);
      getMenuList();
    } else {
      ElMessage.errorr("信息不完整");
    }
  });
};

const getMenuList = async () => {
  try {
    // let params = { ...menuQueryForm };
    const { code, data } = await api.getMenuList(menuQueryForm);
    menuList.value = data;
    console.log(menuList.value);
  } catch (error) {
    throw new Error(error);
  }
};
onMounted(() => {
  getMenuList();
});
</script>

<style scoped lang="less"></style>
