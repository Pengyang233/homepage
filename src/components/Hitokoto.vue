<template>
  <div class="daily-quote" aria-label="每日一句">
    <Transition name="fade" mode="out-in">
      <blockquote :key="quote" class="quote-text" :class="{ 'long-quote': quote.length > 60 }">
        {{ quote }}
      </blockquote>
    </Transition>
  </div>
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
  flex: 1;
  min-width: 0;
  align-self: center;
}

.quote-text {
  margin: 0;
  font-size: clamp(15px, 0.85vw, 17px);
  font-weight: 550;
  line-height: 1.65;
  text-align: center;
  color: #fff;
  overflow-wrap: anywhere;
  text-wrap: pretty;

  &.long-quote {
    font-size: clamp(14px, 0.8vw, 15.5px);
    line-height: 1.6;
  }
}

@media (max-width: 720px) {
  .quote-text {
    font-size: 15px;
    &.long-quote { font-size: 14px; }
  }
}
</style>
