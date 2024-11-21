<script setup>
import { ElNotification } from 'element-plus';

const props = defineProps({
  account: {
    type: Object,
    default: {}
  }
});
const showDrawer = defineModel();
const cancelClick = () => {
  showDrawer.value = false;
};
const emit = defineEmits(['onConfirm']);
const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '普通用户', value: 'user' }
];
const loading = ref(false);
const initState = {
  id: '',
  name: '',
  role: ''
};
const editable = computed(() => {
  return !!props.account;
});
const user = ref({ ...initState });

const rules = {
  name: [
    {
      required: true,
      message: '请输入登录账号',
      trigger: 'blur'
    }
  ],
  role: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'change'
    }
  ]
};
const formRef = ref(null);
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      // loading.value = true;
      //api call
      // loading.value = false;
      ElNotification({
        title: '提示',
        message: '保存成功',
        type: 'success',
        showClose: false,
        duration: 3000
      });
      showDrawer.value = false;
      emit('onConfirm');
    }
  });
};
const onClosed = () => {
  formRef.value.resetFields();
};
const onOpened = () => {
  for (const key in props.account) {
    if (Object.prototype.hasOwnProperty.call(user.value, key)) {
      user.value[key] = props.account[key];
    }
  }
};
</script>

<template>
  <el-drawer
    @closed="onClosed"
    @opened="onOpened"
    size="400"
    :close-on-click-modal="false"
    v-model="showDrawer"
    direction="rtl"
  >
    <template #header>
      <h4 class="font-medium text-body">
        {{ editable ? '编辑' : '新增' }}账号
      </h4>
    </template>
    <template #default>
      <el-form
        ref="formRef"
        label-position="top"
        :rules="rules"
        :model="user"
      >
        <el-form-item
          label="登录账号"
          prop="accountName"
        >
          <el-input
            style="--el-input-text-color: #333"
            v-model="user.name"
            placeholder="请输入登录账号"
          />
        </el-form-item>
        <el-form-item
          label="分配角色"
          prop="role"
        >
          <el-select
            filterable
            style="--el-input-text-color: #333"
            clearable
            v-model="user.role"
            placeholder="请为账号分配角色"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in roles"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div
        style="flex: auto"
        class="border-t pt-4"
      >
        <el-button
          style="width: 100px"
          @click="cancelClick"
        >
          关闭
        </el-button>
        <el-button
          style="width: 100px"
          type="primary"
          @click="handleSubmit"
        >
          {{ editable ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
