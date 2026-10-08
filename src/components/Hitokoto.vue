<template>
  <section class="daily-quote" aria-label="每日一句">
    <span class="eyebrow">每日一句</span>
    <Transition name="fade" mode="out-in">
      <blockquote :key="quote" class="quote-text">{{ quote }}</blockquote>
    </Transition>
  </section>
</template>

<script setup>
import { getDailyQuote } from "@/utils/dailyQuote.js";

const quote = ref(getDailyQuote());
let intervalId;
const refreshQuote = () => { quote.value = getDailyQuote(); };

onMounted(() => {
  refreshQuote();
  intervalId = window.setInterval(refreshQuote, 60_000);
  document.addEventListener("visibilitychange", refreshQuote);
});
onBeforeUnmount(() => {
  window.clearInterval(intervalId);
  document.removeEventListener("visibilitychange", refreshQuote);
});
</script>

<style lang="scss" scoped>
.daily-quote {
  width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 2vw, 32px);
  padding: clamp(8px, 2.5vw, 32px);
  text-align: center;

  .eyebrow {
    color: rgb(245 248 252 / 70%);
    font-size: 13px;
    font-weight: 650;
    letter-spacing: 0.2em;
  }

  .quote-text {
    width: 100%;
    max-width: 34ch;
    margin: 0;
    color: #fff;
    font-size: clamp(20px, 1.8vw, 27px);
    font-weight: 600;
    line-height: 1.8;
    letter-spacing: 0.015em;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }

  @media (max-width: 950px) {
    padding: 4px;
    .quote-text { font-size: 19px; }
  }
}
</style>
