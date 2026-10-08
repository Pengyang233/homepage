<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img v-for="entry in [image]" :key="entry.id" :src="entry.url" class="bg" alt="" @load="handleLoad(entry.id)" @error="handleError(entry.id)" />
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
    <Transition name="fade" mode="out-in">
      <a v-if="store.backgroundShow && store.coverType != '3'" class="down" :href="image.url" target="_blank" rel="noopener noreferrer">下载壁纸</a>
    </Transition>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const fallbackUrl = `/images/background${Math.floor(Math.random() * 10 + 1)}.jpg`;
const image = ref({ id: 0, url: fallbackUrl });
const watchdog = ref(null);
let firstReady = false;
const emit = defineEmits(["loadComplete"]);

const finishFirstLoad = () => {
  if (firstReady) return;
  firstReady = true;
  store.setImgLoadStatus(true);
  emit("loadComplete");
};

const setImage = (url) => {
  image.value = { id: image.value.id + 1, url };
  clearTimeout(watchdog.value);
  const id = image.value.id;
  watchdog.value = setTimeout(() => {
    if (image.value.id !== id) return;
    if (image.value.url !== fallbackUrl) setImage(fallbackUrl);
    else finishFirstLoad();
  }, 3500);
};

const handleLoad = (id) => {
  if (id !== image.value.id) return;
  clearTimeout(watchdog.value);
  finishFirstLoad();
};

const handleError = (id) => {
  if (id !== image.value.id) return;
  clearTimeout(watchdog.value);
  if (image.value.url !== fallbackUrl) setImage(fallbackUrl);
  else finishFirstLoad();
};

const changeBg = (type) => {
  const external = {
    "1": "https://api.dujin.org/bing/1920.php",
    "2": "https://api.vvhan.com/api/wallpaper/views",
    "3": "https://api.vvhan.com/api/wallpaper/acg",
  };
  setImage(external[type] || fallbackUrl);
};

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
