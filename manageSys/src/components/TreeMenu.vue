<template>
  <div class="tree-menu">
    <template v-for="menu in list">
      <el-menu background-color="#011520" text-color="#fff" :router="true">
        <el-sub-menu v-if="menu.parentId[0] === null" :key="menu._id" index="1">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>{{ menu.menuName }}</span>
          </template>
          <tree-menu :list="menu.children"></tree-menu>
        </el-sub-menu>
        <el-menu-item v-else-if="(menu.menuType * 1) === 1" :index="menu.path" index="2">{{ menu.menuName }}
        </el-menu-item>
      </el-menu>
    </template>
  </div>
</template>

<script setup>
const treeProps = defineProps({
  list: {
    type: Array, //类型字符串
    default: [{}],
  },
});
console.log(treeProps.list)
</script>

<style scoped lang="less">
.tree-menu {
  color: #fff;
}
</style>
