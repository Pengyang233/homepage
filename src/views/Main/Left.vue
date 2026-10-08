<template>
  <div :class="store.mobileOpenState ? 'left hidden' : 'left'">
    <Message />
    <SocialLinks />
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import Message from "@/components/Message.vue";
import SocialLinks from "@/components/SocialLinks.vue";
const store = mainStore();
</script>

<style lang="scss" scoped>
.left {
  width: 40%;
  min-width: 0;
  height: min(525px, calc(100dvh - 130px));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  // 左侧内容由签名向下展开，社交链接停靠同高右栏底边。
  @media (max-height: 720px) and (min-width: 721px) { height: 525px; }
  &.hidden { display: none; }
  @media (max-width: 720px) {
    width: 100%;
    height: auto;
    min-height: 320px;
    align-items: center;
    justify-content: center;
    gap: 22px;
  }
}
</style>
