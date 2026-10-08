<template>
  <div class="set" @click.stop>
    <transition name="el-fade-in-linear">
      <close-one
        class="close"
        role="button"
        tabindex="0"
        aria-label="关闭设置"
        @keydown.enter="store.setOpenState = false"
        @keydown.space.prevent="store.setOpenState = false"
        theme="filled"
        size="28"
        fill="#ffffff60"
        
        @click="store.setOpenState = false"
      />
    </transition>
    <el-row :gutter="40">
      <el-col :span="12" class="left">
        <div class="logo text-hidden">
          <span class="bg">{{ siteDisplayName }}</span>
        </div>
        <div class="version">
          <div class="num">v&nbsp;{{ config.version }}</div>
          <el-tooltip content="Github 源代码仓库" placement="right" :show-arrow="false">
            <github-one class="github" theme="outline" size="24" @click="jumpTo(config.github)" />
          </el-tooltip>
        </div>
        <el-card class="update">
          <template #header>
            <div class="card-header">
              <span>更新日志</span>
            </div>
          </template>
          <div class="upnote">
            <div v-for="item in upData.new" :key="item" class="uptext">
              <add-one theme="outline" size="22" />
              {{ item }}
            </div>
            <div v-for="item in upData.fix" :key="item" class="uptext">
              <bug theme="outline" size="22" />
              {{ item }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="right">
        <div class="title">
          <setting-two theme="filled" size="28" fill="#ffffff60" />
          <span class="name">全局设置</span>
        </div>
        <Set />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { CloseOne, SettingTwo, GithubOne, AddOne, Bug } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import Set from "@/components/Set.vue";
import config from "@/../package.json";

const store = mainStore();


// 艺术字名称独立于站点地址
const siteDisplayName = "perrin";

// 更新日志
const upData = reactive({
  new: [
    "采用 Vue 进行重构",
    "壁纸支持个性化设置",
  ],
  fix: ["修复小屏横向滚动", "优化壁纸与一言加载降级", "改善导航键盘交互"],
});

// 跳转源代码仓库
const jumpTo = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<style lang="scss" scoped>
.set {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: min(960px, 92vw);
  height: min(720px, 90dvh);
  overflow-y: auto;
  background: rgb(255 255 255 / 40%);
  border-radius: 6px;
  padding: clamp(16px, 3vw, 40px);

  .close {
    display: block;
    z-index: 5;
    cursor: pointer;
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }

  .el-row {
    min-height: 100%;
    flex-wrap: wrap;

    .left {
      min-width: 0;
      height: 100%;
      padding-left: 40px !important;
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .logo {
        transform: translateY(-8%);
        font-family: "Pacifico-Regular";
        padding-left: 22px;
        width: 100%;
        height: 260px;
        min-height: 140px;
        .bg {
          font-size: 5rem;
        }

        .sm {
          margin-left: 6px;
          font-size: 2rem;
        }

        @media (max-width: 990px) {
          .bg {
            font-size: 4.5rem;
          }
          .sm {
            font-size: 1.7rem;
          }
        }
        @media (max-width: 825px) {
          .bg {
            font-size: 3.8rem;
          }
          .sm {
            font-size: 1.3rem;
          }
        }
      }

      .version {
        display: flex;
        flex-direction: row;
        align-items: center;

        .num {
          font-size: 2rem;
          font-family: "Pacifico-Regular";
        }

        .github {
          width: 24px;
          height: 24px;
          margin-left: 12px;
          margin-top: 6px;

          &:hover {
            transform: scale(1.2);
          }
        }
      }

      .update {
        margin-top: 30px;
        height: 100%;

        :deep(.el-card__body) {
          height: 100%;

          .upnote {
            padding: 20px;
            height: calc(100% - 56px);
            overflow-y: auto;

            .uptext {
              display: flex;
              flex-direction: row;
              align-items: center;
              padding-bottom: 16px;
              font-weight: 500;

              &:nth-last-of-type(1) {
                padding: 0;
              }

              .i-icon {
                width: 22px;
                height: 22px;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }

    .right {
      min-width: 0;
      height: 100%;
      padding-right: 40px !important;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;

        .i-icon {
          width: 28px;
          height: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
  @media (max-width: 720px) {
    .el-row { display: block; }
    .el-row .left, .el-row .right { width: 100%; max-width: 100%; padding: 12px !important; height: auto; }
    .el-row .left .logo { height: auto; min-height: 80px; }
    .el-row .left .logo .bg { font-size: clamp(2rem, 12vw, 4rem); }
  }
</style>
