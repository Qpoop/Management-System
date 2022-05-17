<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">通用后台管理系统</div>
      <div class="desc">- Vue3.0+ElementPlus+Node+Mongoda</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  height: 100%;

  .content {
    position: relative;
    bottom: 40px;

    .sub-title {
      font-size: 40px;
      line-height: 62px;
      color: #333;
    }

    .title {
      font-size: 30px;
      line-height: 42px;
      color: #409eff;
    }

    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }

  .img {
    background-image: url("../assets/images/welcome.png");
    width: 371px;
    height: 438px;
    margin-left: 100px;
  }
}
</style>
