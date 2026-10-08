<template>
  <div class="box cards">
    <transition name="el-fade-in-linear">
      <close-one
        class="close"
        role="button"
        tabindex="0"
        aria-label="关闭信息面板"
        @keydown.enter="store.boxOpenState = false"
        @keydown.space.prevent="store.boxOpenState = false"
        theme="filled"
        size="28"
        fill="#ffffff60"
        @click="store.boxOpenState = false"
      />
    </transition>
    <transition name="el-fade-in-linear">
      <setting-two
        class="setting"
        role="button"
        tabindex="0"
        aria-label="打开设置"
        @keydown.enter="store.setOpenState = true"
        @keydown.space.prevent="store.setOpenState = true"
        theme="filled"
        size="28"
        fill="#ffffff60"
        @click="store.setOpenState = true"
      />
    </transition>
    <div class="content">
      <!-- 可在此处自定义任意内容 -->
      <TimeCapsule />
    </div>
  </div>
</template>

<script setup>
import { CloseOne, SettingTwo } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import TimeCapsule from "@/components/TimeCapsule.vue";

const store = mainStore();
</script>

<style lang="scss" scoped>
.box {
  flex: 1 0 0%;
  margin-left: 0.75rem;
  height: 80%;
  max-width: 50%;
  position: relative;
  animation: fade 0.5s;

  &:hover {
    transform: scale(1);
  }

  .close,
  .setting {
    position: absolute;
    cursor: pointer;
    z-index: 2;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    transition:
      transform 0.3s,
      opacity 0.3s;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }

  .setting {
    right: 56px;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 100%;
    height: 100%;
  }
}
</style>
