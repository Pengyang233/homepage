<template>
  <!-- 每日一句直接显示在头像下方的原引号卡片中，无需点击展开。 -->
  <div class="message">
    <div class="logo">
      <img class="logo-img" :src="siteLogo" alt="logo" />
      <div class="name">
        <span class="bg">{{ siteDisplayName }}</span>
      </div>
    </div>
    <div class="description cards">
      <div class="content">
        <Icon size="16" aria-hidden="true">
          <QuoteLeft />
        </Icon>
        <Hitokoto />
        <Icon size="16" aria-hidden="true">
          <QuoteRight />
        </Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { QuoteLeft, QuoteRight } from "@vicons/fa";
import Hitokoto from "@/components/Hitokoto.vue";

const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO || "/images/icon/perrin-logo.png";
const siteDisplayName = "perrin";
</script>

<style lang="scss" scoped>
.message {
  width: 100%;
  max-width: 460px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(14px, 1.8vw, 20px);

  // 头像与 Pacifico 连体签名保持原有上下结构。
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

  .description {
    width: 100%;
    max-width: 425px;
    margin: 0 auto;
    padding: 12px 14px;
    animation: fade 0.5s;

    .content {
      display: flex;
      justify-content: space-between;
      min-height: 76px;
      align-items: center;
      gap: 10px;

      .xicon {
        flex: none;
        &:first-of-type { align-self: flex-start; }
        &:last-of-type {
          align-self: flex-end;
        }
      }
    }
  }

  @media (max-width: 720px) {
    max-width: 100%;
    align-items: center;
    text-align: center;
    gap: 14px;

    .logo {
      align-items: center;
      gap: 4px;
      .logo-img { width: clamp(120px, 35vw, 148px); }
      .name {
        padding: 0 0 12px;
        .bg { font-size: clamp(3.1rem, 12vw, 4.4rem); }
      }
    }

    .description {
      max-width: 420px;
      margin-top: 0;
      padding: 10px 12px;
    }
  }
}
</style>
