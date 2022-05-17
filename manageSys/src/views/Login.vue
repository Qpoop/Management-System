<template>
  <div class="login-wrapper">
    <div class="modal">
      <div class="title">登录页</div>
      <div class="from">
        <el-form class="login-form" style="max-width: 460px" :model="loginForm" :rules="rules" ref="ruleFormRef">
          <el-form-item prop="userName" class="form_item">
            <el-input v-model="loginForm.userName" placeholder="用户名" size="large">
              <template #prefix>
                <el-icon>
                  <user />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="userPwd" class="form_item">
            <el-input show-password v-model="loginForm.userPwd" placeholder="密码" size="large">
              <template #prefix>
                <el-icon>
                  <lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form_item">
            <el-button color="#626aef" size="large" class="login_button" @click="login(ruleFormRef)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getCurrentInstance, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../store/user';
const router = useRouter();
const api = getCurrentInstance()?.appContext.config.globalProperties.$api
const userStore = useUserStore()

const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({
  userName: "",
  userPwd: "",
});
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { code, data } = await api.login(loginForm)
      if (code === 200) {
        userStore.updateUserInfo(data)
        router.push("/welcome");
      }
    } else {
      ElMessage.error("请输入正确的用户名和密码")
    }
  })
};

</script>

<style scoped lang="less">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(248, 252, 251);

  .modal {
    width: 500px;
    background-color: #fff;
    padding: 50px;
    border-radius: 8px;
    box-shadow: 0 0 9px 10px #888888;

    .title {
      font-size: 30px;
      text-align: center;
      margin-bottom: 40px;
    }

    .from {
      .form_item {
        margin-top: 30px;
      }

      .login_button {
        width: 100%;
        font-size: 18px;
      }
    }
  }
}
</style>
