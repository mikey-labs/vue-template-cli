<script setup>
import { Edit, Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { cleanParam } from 'plugin/Utils.js';
import PageHeader from 'components/Atom/PageHeader.vue';
import { apiGetAccountList } from 'api/Account.js';
import SearchForm from './components/SearchForm.vue';
import AccountDrawer from './components/AccountDrawer.vue';

const router = useRouter();
const data = reactive({
  list: [],
  total: 0,
  loading: false,
  showAccountDrawer: false
});
const currentRow = ref(null);
const queryInitState = {
  pageIndex: 1, //pageNo
  pageSize: 10,
  name: ''
};
const query = ref({
  ...queryInitState
});

const loadData = async (pageNo, pageSize = null) => {
  console.log(pageNo, pageSize);
  if (pageNo) {
    query.value.pageIndex = pageNo;
  }
  if (pageSize) {
    query.value.pageSize = pageSize;
  }
  const params = cleanParam(query.value, false, -1);
  data.loading = true;
  const [err, res] = await apiGetAccountList(params);
  console.log(res);
  data.loading = false;
  if (!err) {
    data.list = res.data;
    data.total = res.count;
  }
};
const handleReset = () => {
  query.value = {
    ...queryInitState
  };
  loadData(1);
};
const handleCreateButtonClick = (row) => {
  currentRow.value = row;
  data.showAccountDrawer = true;
};

onActivated(() => {
  loadData();
});
</script>

<template>
  <Page>
    <PageHeader title="账号管理">
      <template #toolbar>
        <el-button
          :icon="Plus"
          type="primary"
          @click="handleCreateButtonClick"
        >
          创建账号
        </el-button>
      </template>
    </PageHeader>

    <div class="p-4 flex-1 flex flex-col overflow-y-auto space-y-3">
      <SearchForm
        @onReset="handleReset"
        @onSearch="loadData(1)"
        v-model="query"
      />
      <div class="flex-1 flex flex-col bg-white p-2 rounded">
        <el-table
          show-overflow-tooltip
          class="!h-full"
          v-loading="data.loading"
          :data="data.list"
          style="width: 100%; --el-table-text-color: #666"
        >
          <el-table-column
            prop="id"
            label="id"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="登录账号"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="role"
            label="角色"
          >
          </el-table-column>

          <el-table-column label="操作">
            <template #default="{ row }">
              <div class="whitespace-nowrap">
                <el-button
                  link
                  :icon="Edit"
                  type="primary"
                  size="small"
                  @click="handleCreateButtonClick(row)"
                >
                  管理
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end py-3">
          <el-pagination
            hide-on-single-page
            background
            @change="loadData"
            v-model:current-page="query.pageIndex"
            v-model:page-size="query.pageSize"
            layout="total, prev, pager, next,sizes"
            :total="data.total"
          />
        </div>
      </div>
    </div>
    <AccountDrawer
      :account="currentRow"
      v-model="data.showAccountDrawer"
    />
  </Page>
</template>

<style scoped>
:deep(.el-table thead th) {
  font-weight: 500;
  color: #666;
}
</style>
