<template>
  <tree-menu :list=asideProps.menuList></tree-menu>
</template>

<script setup>
import TreeMenu from './TreeMenu.vue';
const asideProps = defineProps({
  menuList: {
    type: Array, //类型字符串
    default: [{}],
  },
});

console.log(asideProps.menuList);
</script>

<style scoped lang="less">
.aside {
  height: 100%;
}
</style>
