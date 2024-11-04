<script setup>
import inactive_icon from 'assets/login/inactive.svg';
import active_icon from 'assets/login/active.svg';
import { showLoadingToast, showToast } from 'vant';
import { useRouter } from 'vue-router';
import { useLoginCoverImage } from '@/hooks/useLoginCoverImage.js';
import { PrivacyPolicy, UserAgreement } from '@/constant/Policy.js';
import { validateUSPhoneNumber } from 'plugin/Utils.js';
import { apiGetVerifyCode } from 'api/User.js';

defineOptions({ name: 'Login' });
const router = useRouter();
const handleToggleProtocol = () => {
  data.isAgree = !data.isAgree;
};

const Policies = [UserAgreement, PrivacyPolicy];
const data = reactive({
  phone: '',
  isAgree: false,
  loading: false,
  showAgreement: false,
  currentPolicyType: 0,
  readUserAgreement: false,
  readPrivacyPolicy: false
});
const handlerSignIn = async () => {
  const { phone, isAgree } = data;
  if (!phone.trim()) {
    showToast('Please enter your phone number');
    return;
  }
  if (!validateUSPhoneNumber(phone.trim())) {
    showToast('Please enter a 10 digit phone number');
    return;
  }
  if (!isAgree) {
    showToast('Please read and agree User Agreement and Privacy Policy');
    return;
  }

  const toast = showLoadingToast();
  const [err] = await apiGetVerifyCode({ mobile: '+1' + phone });
  toast.close();
  if (err) {
    showToast(JSON.parse(err.message).message);
  } else {
    data.phone = '';
    router.replace({
      path: '/login/verify-code',
      query: {
        mobile: phone.trim()
      }
    });
    showToast('The 4-digit code has been sent');
  }
};
/**
 *
 * @param type {0|1}
 */
const handleAgreementClick = (type) => {
  data.showAgreement = true;
  data.currentPolicyType = type;
};
const scrollEl = ref();
const handleScroll = (e) => {
  const { scrollTop, scrollHeight, offsetHeight } = e.target;
  if (scrollHeight - scrollTop - offsetHeight <= 0) {
    if (data.currentPolicyType === 0) {
      data.readUserAgreement = true;
    } else {
      data.readPrivacyPolicy = true;
    }
  }
};
const agreeButtonDisabled = computed(() => {
  return (
    (data.currentPolicyType === 0 && !data.readUserAgreement) ||
    (data.currentPolicyType === 1 && !data.readPrivacyPolicy)
  );
});
const handleAgreeClick = () => {
  closePop();
  data.isAgree = true;
};
const closePop = () => {
  data.showAgreement = false;
  setTimeout(() => {
    scrollEl.value.scrollTop = 0;
  }, 300);
};
</script>

<template>
  <Page
    :style="useLoginCoverImage()"
    class="px-6 h-full bg-no-repeat bg-cover"
  >
    <div class="flex justify-center">
      <img
        src="assets/logo.svg"
        class="text-5xl mt-[140px] text-center"
        alt=""
      />
    </div>
    <div class="text-center text-white mt-[6.5625rem]">
      Sign in with phone number
    </div>
    <div class="mt-4">
      <van-field
        class="rounded text-base"
        type="text"
        clearable
        placeholder="Enter mobile number"
        autocomplete="off"
        style="--van-field-label-width: auto"
        v-model="data.phone"
      >
        <template #label>
          <span class="border-r pr-4">+1</span>
        </template>
      </van-field>
    </div>
    <div class="mt-6">
      <van-button
        block
        type="primary"
        @click="handlerSignIn"
        :loading="data.loading"
      >
        Sign In
      </van-button>
    </div>
    <div
      class="mt-4 flex"
      @click="handleToggleProtocol"
    >
      <span class="leading-[1.4] flex-shrink-0 align-top">
        <img
          :src="data.isAgree ? active_icon : inactive_icon"
          alt=""
          class="inline"
        />
      </span>
      <div class="inline-block leading-[1.4] pl-2 flex-1">
        <span class="text-xs text-white">
          I have read and agree to Tagoo's
          <span
            @click.stop="handleAgreementClick(0)"
            class="text-secondary"
          >
            User Agreement
          </span>
          and
          <span
            @click.stop="handleAgreementClick(1)"
            class="text-secondary"
          >
            Privacy Policy
          </span>
        </span>
      </div>
    </div>
    <van-popup
      round
      :style="{
        height: '80%',
        width: '100%',
        overflow: 'hidden'
      }"
      v-model:show="data.showAgreement"
    >
      <div
        class="flex w-full space-y-4 px-4 pt-8 pb-4 flex-col h-full overflow-hidden"
      >
        <div class="font-bold text-center">
          {{ Policies[data.currentPolicyType].title }}
        </div>
        <div
          @scroll="handleScroll"
          ref="scrollEl"
          class="text-center overflow-y-auto flex-1"
        >
          <div
            v-html="Policies[data.currentPolicyType].content"
            class="text-sm text-justify whitespace-pre-wrap"
          ></div>
        </div>
        <div class="flex py-3 space-x-2">
          <van-button
            color="#fff"
            block
            class="text-sm"
            @click="closePop"
          >
            <span class="text-[#999]">Cancel</span>
          </van-button>
          <van-button
            @click="handleAgreeClick"
            class="text-sm"
            :disabled="agreeButtonDisabled"
            :color="agreeButtonDisabled ? '#fff' : '#0F77F0'"
            type="primary"
            block
          >
            <span
              :class="agreeButtonDisabled ? 'text-[#323232]' : 'text-white'"
            >
              Agree
            </span>
          </van-button>
        </div>
      </div>
    </van-popup>
  </Page>
</template>
