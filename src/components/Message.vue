<template>
  <!-- 基本信息 -->
  <div class="message">
    <!-- Logo -->
    <div class="logo">
      <img class="logo-img" :src="siteLogo" alt="logo" />
      <div class="name">
        <span class="bg">{{ siteDisplayName }}</span>
      </div>
    </div>
    <!-- 简介 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <Icon size="16">
          <QuoteLeft />
        </Icon>
        <Transition name="fade" mode="out-in">
          <div :key="descriptionText.hello + descriptionText.text" class="text">
            <p>{{ descriptionText.hello }}</p>
            <p>{{ descriptionText.text }}</p>
          </div>
        </Transition>
        <Icon size="16">
          <QuoteRight />
        </Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { QuoteLeft, QuoteRight } from "@vicons/fa";
import { Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";
const store = mainStore();

// 主页站点logo
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO || "/images/icon/perrin-logo.png";
// 艺术字名称独立于站点地址
const siteDisplayName = "perrin";

// 简介区域文字
const descriptionText = reactive({
  hello: import.meta.env.VITE_DESC_HELLO,
  text: import.meta.env.VITE_DESC_TEXT,
});

// 切换右侧功能区
const changeBox = () => {
  if (store.getInnerWidth >= 721) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
  }
};

// 监听状态变化
watch(
  () => store.boxOpenState,
  (value) => {
    if (value) {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO_OTHER;
      descriptionText.text = import.meta.env.VITE_DESC_TEXT_OTHER;
    } else {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO;
      descriptionText.text = import.meta.env.VITE_DESC_TEXT;
    }
  },
);
</script>

<style lang="scss" scoped>
.message {
  width: 100%;
  max-width: 460px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  // 让原版头像与 Pacifico 连体签名形成上下主视觉。
  .logo {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    animation: fade 0.5s;

    .logo-img {
      display: block;
      width: clamp(140px, 12.5vw, 170px);
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 50%;
    }

    .name {
      width: 100%;
      min-width: 0;
      // Pacifico 的 p/r 等手写笔画会超出字体度量盒；字标不能继承裁剪样式。
      padding: 0 0 16px;
      overflow: visible;
      text-align: center;
      line-height: 1.45;
      font-family: "Pacifico-Regular";
      .bg {
        display: block;
        font-size: clamp(3.4rem, 6vw, 5rem);
        line-height: 1.45;
      }
    }
  }

  // 签名卡片和头像、字标共用左栏的水平中心线，保留展开交互。
  .description {
    width: 100%;
    max-width: 425px;
    margin: 10px auto 0;
    padding: 13px 16px;
    animation: fade 0.5s;

    .content {
      display: flex;
      justify-content: space-between;
      gap: 10px;

      .text {
        min-width: 0;
        flex: 1;
        margin: 6px 0;
        text-align: center;
        line-height: 1.75rem;
        font-size: clamp(15px, .85vw, 17px);
        font-weight: 550;
        transition: opacity 0.2s;

        p:first-of-type {
          font-family: "Pacifico-Regular";
          font-weight: 400;
        }
        p {
          overflow-wrap: anywhere;
        }
      }

      .xicon {
        flex: none;
        &:last-of-type {
          align-self: flex-end;
        }
      }
    }
  }

  @media (max-width: 720px) {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .logo {
      align-items: center;
      gap: 4px;
      .logo-img {
        width: clamp(120px, 35vw, 148px);
      }
      .name {
        padding: 0 0 12px;
        .bg {
          font-size: clamp(3.1rem, 12vw, 4.4rem);
        }
      }
    }

    .description {
      max-width: 420px;
      margin-top: 8px;
      padding: 10px 14px;
      pointer-events: none;
      .content .text {
        flex: 1;
      }
    }
  }
}
</style>
