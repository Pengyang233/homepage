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
  align-items: center;
  // 上半区居中容纳头像、签名与语录；联系方式仍与右栏底边对齐。
  gap: clamp(16px, 2vh, 22px);

  .message {
    flex: 1 1 auto;
    min-height: 0;
  }
  .social {
    flex: 0 0 auto;
  }

  @media (max-height: 720px) and (min-width: 721px) {
    height: 525px;
  }

  &.hidden { display: none; }

  @media (max-width: 720px) {
    width: 100%;
    height: auto;
    min-height: 320px;
    justify-content: center;
    gap: clamp(18px, 4vw, 24px);

    .message { flex: none; min-height: auto; }
  }
}
</style>
