<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      :src="bgUrl"
      class="bg"
      alt="cover"
      @load="imgLoadComplete"
      @error="imgLoadError"

    />
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
    <Transition name="fade" mode="out-in">
      <a
        v-if="store.backgroundShow && store.coverType != '3'"
        class="down"
        :href="bgUrl"
        target="_blank"
      >
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";

const store = mainStore();
const bgUrl = ref(null);
const fallbackUrl = `/images/background${Math.floor(Math.random() * 10 + 1)}.jpg`;
const watchdog = ref(null);
const notified = ref(false);
const loaded = ref(false);
const emit = defineEmits(["loadComplete"]);

// 壁纸随机数
// 请依据文件夹内的图片个数修改 Math.random() 后面的第一个数字

// 更换壁纸链接
const changeBg = (type) => {
  if (type == 0) {
    bgUrl.value = fallbackUrl;
  } else if (type == 1) {
    bgUrl.value = "https://api.dujin.org/bing/1920.php";
  } else if (type == 2) {
    bgUrl.value = "https://api.vvhan.com/api/wallpaper/views";
  } else if (type == 3) {
    bgUrl.value = "https://api.vvhan.com/api/wallpaper/acg";
  }
};

// 无论图片是否可用，页面只完成一次初始化。
const finishLoading = () => {
  if (loaded.value) return;
  loaded.value = true;
  store.setImgLoadStatus(true);
  emit("loadComplete");
};
const imgLoadComplete = () => {
  clearTimeout(watchdog.value);
  finishLoading();
};

// 图片显示失败
const imgLoadError = () => {
  clearTimeout(watchdog.value);
  if (bgUrl.value === fallbackUrl) {
    finishLoading(); // 本地图片也失败时仍能显示纯色背景与内容
    return;
  }
  if (!notified.value) {
    notified.value = true;
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  bgUrl.value = `/images/background${bgRandom}.jpg`;
};

// 监听壁纸切换
watch(
  () => store.coverType,
  (value) => {
    changeBg(value);
    if (!loaded.value) startWatchdog();
  },
);

const startWatchdog = () => {
  clearTimeout(watchdog.value);
  watchdog.value = setTimeout(() => {
    if (bgUrl.value !== fallbackUrl) bgUrl.value = fallbackUrl;
    finishLoading();
  }, 3500);
};

onMounted(() => {
  changeBg(store.coverType);
  startWatchdog();
});

onBeforeUnmount(() => {
  clearTimeout(watchdog.value);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;
  background: #333;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    filter: blur(20px) brightness(0.3);
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }
  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;
    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }
  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }
    &:active {
      transform: scale(1);
    }
  }
}
</style>
