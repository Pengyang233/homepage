<template>
  <div class="function cards" aria-label="当前时间、日期与天气">
    <div class="clock-panel">
      <time class="time" :datetime="localDateTime">{{ currentTime.hour }}:{{ currentTime.minute }}</time>
      <span class="date">{{ currentTime.month }}月{{ currentTime.day }}日 · {{ currentTime.weekday }}</span>
    </div>
    <Weather class="weather-panel" />
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/getTime";
import Weather from "@/components/Weather.vue";

const currentTime = ref(getCurrentTime());
const localDateTime = computed(() =>
  `${currentTime.value.year}-${currentTime.value.month}-${currentTime.value.day}T${currentTime.value.hour}:${currentTime.value.minute}`
);
let intervalId;
onMounted(() => { intervalId = setInterval(() => { currentTime.value = getCurrentTime(); }, 10_000); });
onBeforeUnmount(() => clearInterval(intervalId));
</script>

<style scoped lang="scss">
.function {
  position: relative;
  z-index: 5; // 天气城市弹层需要浮在下方搜索卡片之上
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(118px, 35%);
  min-height: 150px;
  padding: 0;
  background: rgb(13 23 37 / 45%);

  .clock-panel {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px clamp(16px, 2vw, 26px);
    text-align: center;
  }

  .time {
    display: block;
    font-size: clamp(2.65rem, 4.2vw, 3.9rem);
    font-weight: 600;
    letter-spacing: -.052em;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
  }

  .date {
    font-size: clamp(13px, .9vw, 15px);
    font-weight: 550;
    line-height: 1.35;
    color: rgb(239 245 252 / 88%);
    white-space: nowrap;
  }

  .weather-panel {
    min-width: 0;
    border-left: 1px solid rgb(255 255 255 / 15%);
    border-radius: 0 15px 15px 0;
    background:
      radial-gradient(ellipse at 65% 25%, rgb(255 255 255 / 11%), transparent 78%),
      rgb(255 255 255 / 6%);
  }

  @media (max-width: 980px) {
    .clock-panel { padding-inline: 18px; }
    .time { font-size: clamp(2.5rem, 4.4vw, 3.35rem); }
  }

  @media (max-width: 410px) {
    grid-template-columns: minmax(0, 1fr) minmax(106px, 38%);
    min-height: 140px;
    .clock-panel { padding: 16px 12px; gap: 11px; }
    .time { font-size: clamp(2.25rem, 11vw, 2.65rem); }
    .date { font-size: 12px; }
  }
}
</style>
