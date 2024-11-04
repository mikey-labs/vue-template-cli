<script setup>
import { defineModel } from 'vue';

const props = defineProps({
  title: String,
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  block: {
    type: Boolean,
    default: false
  },
  onCancelClick: Function
});
const showDialog = defineModel({ type: Boolean });
const emit = defineEmits(['onConfirm']);
const handleConfirmClick = () => {
  emit('onConfirm');
};
const handleCancelClick = () => {
  if (props.onCancelClick) props.onCancelClick();
  else {
    showDialog.value = false;
  }
};
</script>

<template>
  <van-dialog
    class-name="_confirm"
    v-model:show="showDialog"
  >
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <slot> </slot>
    <template #footer>
      <slot name="footer">
        <div
          :class="{
            'space-x-2': !block,
            'flex-col-reverse': block
          }"
          class="pb-6 flex pt-4 px-4"
        >
          <van-button
            :class="{ 'mt-2': block }"
            block
            plain
            color="#EEEEEE"
            @click="handleCancelClick"
          >
            <span class="text-sm text-[#999]">{{ cancelText }}</span>
          </van-button>
          <van-button
            block
            @click="handleConfirmClick"
            type="primary"
          >
            <span class="text-sm"> {{ confirmText }} </span>
          </van-button>
        </div>
      </slot>
    </template>
  </van-dialog>
</template>
<style>
._confirm .van-dialog__header {
  padding: 40px 16px;
}
</style>
