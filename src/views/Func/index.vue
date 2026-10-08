<template>
  <div class="function cards">
    <div class="time">{{ currentTime.hour }}:{{ currentTime.minute }}</div>
    <div class="meta">
      <div class="date">{{ currentTime.month }}月{{ currentTime.day }}日 · {{ currentTime.weekday }}</div>
      <Weather />
    </div>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/getTime";
import Weather from "@/components/Weather.vue";

const currentTime = ref(getCurrentTime());
let intervalId;
onMounted(() => { intervalId = setInterval(() => { currentTime.value = getCurrentTime(); }, 10_000); });
onBeforeUnmount(() => clearInterval(intervalId));
</script>

<style scoped lang="scss">
.function {
  position: relative; z-index: 5; // Weather popover must sit above the search card.
  display: flex; gap: 25px; align-items: center; padding: 25px 30px; min-height: 125px;
  background: rgb(13 22 34 / 28%);
  .time { font-size: clamp(2.5rem, 4.4vw, 4.2rem); font-weight: 500; letter-spacing: -.035em; font-variant-numeric: tabular-nums; line-height: 1; }
  .meta {
    padding-left: 25px; border-left: 1px solid rgb(255 255 255 / 19%); min-width: 0;
    .date { margin-bottom: 8px; white-space: nowrap; font-size: clamp(15px, .85vw, 17px); font-weight: 600; }
  }
  @media (max-width: 980px) { padding: 20px; gap: 15px; .meta { padding-left: 15px; } }
  @media (max-width: 410px) { .time { font-size: 2.3rem; } .meta .date { font-size: 14px; } }
}
</style>
