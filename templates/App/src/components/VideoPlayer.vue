<script setup>
import { onMounted, ref, watch } from 'vue';
import muted_icon from 'assets/workout/muted.svg';
import loud_icon from 'assets/workout/loud.svg';
import { formatSeconds } from 'plugin/Utils.js';

const props = defineProps({
  url: {
    type: String,
    default: null
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  fit: {
    type: Boolean,
    default: false
  },
  disableClick: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: false
  }
});
const video = ref();
const time = ref('00:00');
const loading = ref(true);
const showPlayIcon = ref(false);
const muted = ref(false);
const srcUrl = ref(props.url);
const emit = defineEmits(['onPlay', 'onPause']);
watch(
  () => props.url,
  (val) => {
    console.log(val);
    // console.log(val);
    srcUrl.value = val;
    // if (!video.value.paused) {
    //   video.value.pause();
    // }
  }
);

function playPause() {
  if (props.disableClick) {
    return;
  }
  if (video.value.paused) {
    // console.log('play');
    emit('onPlay');
    video.value.play();
    showPlayIcon.value = false;
  } else {
    // console.log('pause');
    emit('onPause');
    video.value.pause();
    showPlayIcon.value = true;
  }
}
const makeLoudOrMute = () => {
  if (muted.value) {
    makeLoud();
  } else {
    makeMute();
  }
};
function makeLoud() {
  video.value.muted = false;
  video.value.volume = 1;
  muted.value = false;
}

function makeMute() {
  video.value.muted = true;
  muted.value = true;
}
const onCanPlay = (e) => {
  // console.log('onCanPlay');
};
const onLoadeddata = () => {
  loading.value = false;
  time.value = formatSeconds(video.value.duration);
  showPlayIcon.value = !props.autoplay;
  props.autoplay && play();

  // console.log('onLoadeddata');
};
const onPlaying = () => {
  // console.log('onPlaying');
  loading.value = false;
};
const onPause = (e) => {
  // console.log('onPause', e);
};
const onEnded = (e) => {
  showPlayIcon.value = true;
  // console.log('onEnded', e);
};
const pause = () => {
  if (!video.value.paused) {
    // console.log('play');
    video.value.pause();
    showPlayIcon.value = true;
  }
};
const onTimeUpdate = (e) => {
  if (!video.value) return;
  const { duration, currentTime } = video.value;
  time.value = formatSeconds(duration - currentTime);
};
const onWaiting = () => {
  loading.value = true;
};
const play = () => {
  if (video.value.paused) {
    // console.log('play');
    video.value.play();
    showPlayIcon.value = false;
  }
};
const rePlay = () => {
  video.value.currentTime = 0;
  play();
};
onMounted(() => {});
defineExpose({
  play,
  pause,
  rePlay
});
</script>

<template>
  <div class="video-player w-full h-full relative overflow-hidden">
    <div
      v-if="loading"
      class="absolute z-10 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
    >
      <van-loading
        size="48px"
        color="#0F77F0"
        v-if="loading"
      />
    </div>
    <div
      v-if="showPlayIcon"
      @click.stop="playPause"
      class="absolute z-10 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
    >
      <img
        width="60"
        src="assets/workout/play.svg"
        alt=""
      />
    </div>

    <div
      @click.stop="makeLoudOrMute"
      class="absolute flex justify-center items-center w-10 h-10 z-10 rounded-full bg-body top-[4.25rem] right-4 safe-area"
    >
      <img
        :src="muted ? muted_icon : loud_icon"
        alt=""
      />
    </div>
    <!--      :muted="autoplay"-->

    <video
      :autoplay="autoplay"
      :loop="loop"
      @waiting="onWaiting"
      @click.stop="playPause"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @pause="onPause"
      @playing="onPlaying"
      @loadeddata="onLoadeddata"
      @canplay="onCanPlay"
      ref="video"
      playsinline
      :class="fit ? 'object-cover' : 'object-contain'"
      class="bg-body w-full h-full"
      :src="srcUrl"
    >
      <!--      <source-->
      <!--        :src="srcUrl"-->
      <!--        type="video/mp4"-->
      <!--      />-->
    </video>
    <div
      @click="playPause"
      class="absolute bg-body py-0.5 rounded-2xl px-2 text-xs bg-opacity-80 text-white z-10 right-2 bottom-2"
    >
      {{ time }}
    </div>
  </div>
</template>

<style scoped>
.safe-area {
  margin-top: constant(safe-area-inset-top);
  margin-top: env(safe-area-inset-top);
}
</style>
