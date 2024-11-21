<script setup>
import { reactive, ref } from 'vue';
import bg_bottom from 'assets/login/bg-bottom.svg';
import bg_top from 'assets/login/bg-top.svg';
import item_img from 'assets/login/item.png';
import { apiLogin } from 'api/User.js';
import { useUserStore } from '@/store/useUserStore.js';
import { useRouter } from 'vue-router';

const pageStyle = {
  backgroundImage: `url("${bg_top}"),url("${bg_bottom}"),url("${item_img}")`,
  backgroundPosition: '-50% -30%,140% 180%,10% 80%',
  backgroundSize: '50%, 50%,400px'
};
//
const userStore = useUserStore();

const router = useRouter();
const formEl = ref();
const data = reactive({
  username: '',
  password: ''
});
const loading = ref(false);
const rules = reactive({
  username: [{ required: true, message: '请输入您的账号', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '请输入您的密码',
      trigger: 'blur'
    }
  ]
});
const handleFormSubmit = async () => {
  if (!formEl.value) return;
  await formEl.value.validate(async (valid, fields) => {
    if (valid) {
      // 验证通过，可以开始提交了
      // 模拟登录
      userStore.setTokenInfo({ accessToken: 'access_token' }, true);
      userStore.setUser({ name: 'Mikey' }, true);
      await router.replace('/');
      // loading.value = true;
      // const [err, res] = await apiLogin({
      //   username: data.username,
      //   password: data.password,
      // });
      // loading.value = false;
      // if (!err) {
      //   const { accessToken, payLoads } = res;
      //   userStore.setTokenInfo({ accessToken }, true);
      //   userStore.setUser(payLoads, true);
      //   await router.replace('/');
      // }
    }
  });
};
</script>
<template>
  <Page
    class="bg-no-repeat bg-[#4285F4]"
    :style="pageStyle"
  >
    <div
      class="bg-white rounded-xl pb-[60px] pt-[4rem] px-[50px] absolute right-24 top-20"
      style="box-shadow: 0 8px 32px rgba(66, 133, 244, 0.15)"
    >
      <div
        class="flex items-center relative top-[-2rem] right-[-1.5rem] justify-end mb-2"
      >
        YOU LOGO
      </div>
      <div
        class="font-medium items-end flex justify-center mb-8 text-[#294893] text-[20px]"
      >
        账户登录 ｜
        <span class="text-base pl-2.5">管理端</span>
      </div>
      <el-form
        ref="formEl"
        hide-required-asterisk
        :rules="rules"
        :model="data"
        label-position="top"
        style="--el-input-border-color: none"
      >
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input
            style="--el-input-text-color: #333"
            v-model="data.username"
            placeholder="请输入您的账号"
            class="w-[240px] text-sm !shadow-none h-9"
          />
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
        >
          <el-input
            style="--el-input-text-color: #333"
            show-password
            @keyup.enter="handleFormSubmit"
            v-model="data.password"
            placeholder="请输入您的密码"
            class="w-[240px] !shadow-none h-9"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            tabindex="1"
            :loading="loading"
            @click="handleFormSubmit"
            class="w-full mt-6 !h-9"
            type="primary"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </Page>
</template>
<style scoped>
:deep(.el-form-item--label-top .el-form-item__label) {
  margin-bottom: 2px;
  font-size: 12px;
}
</style>
