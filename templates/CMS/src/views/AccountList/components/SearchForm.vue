<script setup>
import { Refresh, Search } from '@element-plus/icons-vue';

const querySpan = 8;
/**
 *
 * @type {{parentAccountId: string, roleId: string, name: string, enabled: boolean}}
 */
const query = defineModel({ type: Object });
const emit = defineEmits(['onSearch', 'onReset']);

const handleSearch = () => {
  emit('onSearch');
};

const handleReset = () => {
  emit('onReset');
};
</script>

<template>
  <el-row
    :gutter="8"
    class="bg-white p-4 rounded"
  >
    <el-col
      :span="querySpan"
      :md="10"
    >
      <el-form-item
        label-position="left"
        label="账号或姓名"
      >
        <el-input
          clearable
          placeholder="请输入"
          style="--el-input-text-color: #666"
          v-model="query.name"
        >
        </el-input>
      </el-form-item>
    </el-col>

    <el-col
      :span="6"
      :md="4"
    >
      <el-form-item label-position="left">
        <template #label>
          <span class="text-white">&nbsp;</span>
        </template>
        <div class="flex w-full">
          <el-button
            type="primary"
            @click="handleSearch"
          >
            <el-icon>
              <Search />
            </el-icon>
            <span class="pl-0.5 pr-1">搜索</span>
          </el-button>
          <el-button
            @click="handleReset"
            plain
            type="primary"
          >
            <el-icon>
              <Refresh />
            </el-icon>
            <span class="pl-0.5 pr-1">重置</span>
          </el-button>
        </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 8px;
}
:deep(.el-form-item--label-top .el-form-item__label) {
  margin-bottom: 2px;
}
</style>
