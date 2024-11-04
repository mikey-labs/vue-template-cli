<script setup>
import { formatDate } from '@zhengxy/use';

const props = defineProps({
  data: {
    type: Object
  }
});
</script>

<template>
  <div class="px-4 flex mt-4">
    <img
      v-error
      class="w-8 flex-shrink-0 h-8 object-cover rounded-full"
      :src="data.image"
      alt=""
    />
    <div
      class="flex-1 overflow-hidden pb-4 border-[#ddd] border-b px-2 text-xs"
    >
      <div class="flex items-center w-full overflow-hidden">
        <div class="text-[#666] flex-1 truncate mr-1">
          {{ data.name }}
        </div>
        <div class="text-[#666] text-xs flex-shrink-0">
          {{ formatDate(new Date(data.date), 'MM-dd hh:mm') }}
        </div>
      </div>
      <div class="mt-2 text-sm">
        {{ data.content }}
      </div>
    </div>
  </div>
</template>
