<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img :src="bgUrl" class="bg" alt="" @load="imgLoadComplete" @error="imgLoadError" />
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
    <Transition name="fade" mode="out-in">
      <a v-if="store.backgroundShow && store.coverType != '3'" class="down" :href="bgUrl" target="_blank" rel="noopener noreferrer">下载壁纸</a>
    </Transition>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const fallbackUrl = `/images/background${Math.floor(Math.random() * 10 + 1)}.jpg`;
const bgUrl = ref(fallbackUrl);
const watchdog = ref(null);
const loaded = ref(false);
const emit = defineEmits(["loadComplete"]);

const finishLoading = () => {
  if (loaded.value) return;
  loaded.value = true;
  store.setImgLoadStatus(true);
  emit("loadComplete");
};

const changeBg = (type) => {
  const external = {
    "1": "https://api.dujin.org/bing/1920.php",
    "2": "https://api.vvhan.com/api/wallpaper/views",
    "3": "https://api.vvhan.com/api/wallpaper/acg",
  };
  bgUrl.value = external[type] || fallbackUrl;
  if (!loaded.value) startWatchdog();
};

const imgLoadComplete = () => {
  clearTimeout(watchdog.value);
  finishLoading();
};

const imgLoadError = () => {
  clearTimeout(watchdog.value);
  if (bgUrl.value !== fallbackUrl) {
    bgUrl.value = fallbackUrl;
  }
  finishLoading();
};

function startWatchdog() {
  clearTimeout(watchdog.value);
  watchdog.value = setTimeout(() => {
    if (bgUrl.value !== fallbackUrl) bgUrl.value = fallbackUrl;
    finishLoading();
  }, 3500);
}

watch(() => store.coverType, changeBg);
onMounted(() => changeBg(store.coverType));
onBeforeUnmount(() => clearTimeout(watchdog.value));
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  inset: 0;
  transition: 0.25s;
  z-index: -1;
  background: #333;
  &.show { z-index: 1; }
  .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    filter: blur(20px) brightness(0.3);
    transition: filter 0.3s, transform 0.3s;
    animation: fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }
  .gray {
    opacity: 1;
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
    transition: 1.5s;
    &.hidden { opacity: 0; }
  }
  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover { transform: scale(1.05); background-color: #00000060; }
    &:active { transform: scale(1); }
  }
}
</style>
