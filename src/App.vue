<template>
  <!-- 加载 -->
  <Loading />
  <!-- 壁纸 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main id="main" v-if="store.imgLoadStatus">
      <div class="container" v-show="!store.backgroundShow">
        <section class="all">
          <MainLeft />
          <MainRight />
          <!-- 原时光胶囊信息面板代码保留于 src/views/Box，暂不挂载。 -->
        </section>
        <!-- 全局设置暂时关闭；MoreSet / Set 组件文件保留。 -->
      </div>
      <!-- 移动端菜单按钮 -->
      <Icon
        class="menu"
        size="24"
        v-show="!store.backgroundShow"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>
      <!-- 页脚 -->
      <Transition name="fade" mode="out-in">
        <Footer v-if="showFooter && !store.backgroundShow" class="f-ter" />
      </Transition>
    </main>
  </Transition>
</template>

<script setup>
import { helloInit, checkDays } from "@/utils/getTime.js";
import { HamburgerButton, CloseSmall } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import { Icon } from "@vicons/utils";
import Loading from "@/components/Loading.vue";
import MainLeft from "@/views/Main/Left.vue";
import MainRight from "@/views/Main/Right.vue";
import Background from "@/components/Background.vue";
import Footer from "@/components/Footer.vue";
import cursorInit from "@/utils/cursor.js";

const store = mainStore();
// 暂时隐藏页面底部版权栏，保留 Footer 组件及 LICENSE 中的原作者版权声明。
const showFooter = false;
let disposeCursor = () => {};
const onEscape = (event) => {
  if (event.key === "Escape") {
    store.setOpenState = false;
    store.boxOpenState = false;
  }
};

const handleMiddleClick = (event) => {
  if (event.button !== 1 || event.target.closest("a, button, input, textarea, select, [role=button]")) return;
  store.backgroundShow = !store.backgroundShow;
};

// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    // 欢迎提示
    helloInit();
    // 默哀模式
    checkDays();
  });
};

// 监听宽度变化
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 721) {
      store.boxOpenState = false;
      store.setOpenState = false;
    }
  },
);

onMounted(() => {
  // 自定义鼠标
  disposeCursor = cursorInit();

  // 鼠标中键仅在页面非交互区域切换壁纸
  window.addEventListener("mousedown", handleMiddleClick);
  window.addEventListener("keydown", onEscape);

  // 监听当前页面宽度
  getWidth();
  window.addEventListener("resize", getWidth);

  // 控制台欢迎信息
  console.info(
    "%cPerrin's Homepage",
    "font-size: 20px;font-weight: 600;color: rgb(244,167,89);",
  );
});

onBeforeUnmount(() => {
  disposeCursor();
  window.removeEventListener("resize", getWidth);
  window.removeEventListener("mousedown", handleMiddleClick);
  window.removeEventListener("keydown", onEscape);
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s;
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    padding: 0 0.5vw;
    .all {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: clamp(24px, 4vw, 60px);
      max-width: 1340px;
      margin: 0 auto;
    }
    @media (max-width: 720px) {
      .all { padding: 35px 14px 70px; }
    }
    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      animation: fade 0.5s;
    }
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  .menu {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 84%;
    left: calc(50% - 28px);
    width: 56px;
    height: 34px;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    transition: transform 0.3s;
    animation: fade 0.5s;
    &:active {
      transform: scale(0.95);
    }
    .i-icon {
      transform: translateY(2px);
    }
    @media (min-width: 721px) {
      display: none;
    }
  }
  @media (max-height: 720px) {
    overflow-y: auto;
    overflow-x: hidden;
    .container {
      min-height: 721px;
      height: auto;
      .more {
        min-height: 721px;
        height: auto;
        width: 100%;
      }
      @media (min-width: 391px) {
        // w 1201px ~ max
        padding-left: 0.7vw;
        padding-right: 0.25vw;
        @media (max-width: 1200px) { // w 1101px ~ 1280px
          padding-left: 2.3vw;
          padding-right: 1.75vw;
        }
        @media (max-width: 1100px) { // w 993px ~ 1100px
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
        @media (max-width: 992px) { // w 901px ~ 992px
          padding-left: 2.3vw;
          padding-right: 1.7vw;
        }
        @media (max-width: 900px) { // w 391px ~ 900px
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
      }
    }
    .menu {
      top: min(84vh, 605px);
      left: calc(50% - 28px);
      @media (min-width: 391px) {
        left: calc(50% - 25px);
      }
    }
    .f-ter {
      top: auto;
      bottom: 0;
      @media (min-width: 391px) {
        padding-left: 6px;
      }
    }
  }
  @media (max-width: 390px) {
    overflow-x: hidden;
    .container { width: 100%; }
    .menu { left: calc(50% - 28px); }
    .f-ter { width: 100%; }
  }
}
</style>
