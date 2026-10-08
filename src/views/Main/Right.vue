<template>
  <div :class="store.mobileOpenState ? 'right' : 'right hidden'">
    <!-- 移动端 Logo -->
    <div class="logo text-hidden" @click="store.mobileFuncState = !store.mobileFuncState">
      <span class="bg">{{ siteDisplayName }}</span>
    </div>
    <!-- 功能区 -->
    <Func />
    <QuickSearch />
    <!-- 网站链接 -->
    <Link />
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import Func from "@/views/Func/index.vue";
import Link from "@/components/Links.vue";
import QuickSearch from "@/components/QuickSearch.vue";
const store = mainStore();

// 艺术字名称独立于站点地址
const siteDisplayName = "perrin";
</script>

<style lang="scss" scoped>
.right {
  width: 60%;
  min-width: 0;
  height: min(525px, calc(100dvh - 130px));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 17px;
  .logo {
    display: none;
    font-family: "Pacifico-Regular";
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 8px;
  }
  @media (max-width: 720px) {
    width: 100%;
    height: auto;
    max-width: 560px;
    justify-content: center;
    .logo { display: block; }
    &.hidden { display: none; }
  }
  @media (max-height: 740px) and (min-width: 721px) { gap: 12px; }
}
</style>
