<template>
  <form class="quick-search cards" role="search" @submit.prevent="submit">
    <MonoIcon name="search" class="search-icon" />
    <input ref="searchInput" v-model="query" aria-label="搜索网页或输入网址"
      placeholder="搜索网页，或输入网址…" autocomplete="off" spellcheck="false" />
    <div class="engine-actions" role="group" aria-label="搜索引擎">
      <button v-for="option in engineOptions" :key="option.value" type="button"
        class="engine-button" :class="{ 'is-selected': engine === option.value }"
        :aria-label="`使用 ${option.label} 搜索`" :title="option.label"
        :aria-pressed="engine === option.value" @click="chooseEngine(option.value)">
        <MonoIcon :name="option.value" />
      </button>
    </div>
  </form>
</template>

<script setup>
import MonoIcon from "@/components/MonoIcon.vue";
import { resolveNavigation, SEARCH_ENGINES } from "@/utils/quickSearch.js";

const engineOptions = [
  { value: "google", label: "Google" },
  { value: "bing", label: "Bing" },
  { value: "yandex", label: "Yandex" },
];
const query = ref("");
const searchInput = ref(null);
const engine = ref("google");
const storageKey = "perrin-search-engine-v1";

watch(engine, (value) => {
  try { window.localStorage.setItem(storageKey, value); } catch { /* Private mode */ }
});

const navigate = (selectedEngine) => {
  const destination = resolveNavigation(query.value, selectedEngine);
  if (destination) window.location.assign(destination);
};
const submit = () => navigate(engine.value);
const chooseEngine = (selectedEngine) => {
  engine.value = selectedEngine;
  // No text: only select the engine. With text: search immediately.
  if (query.value.trim()) navigate(selectedEngine);
};

const handleKeydown = (event) => {
  const target = event.target;
  const editing = target instanceof HTMLElement &&
    (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);
  if (editing || event.altKey) return;
  if (event.key === "/" || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
    event.preventDefault();
    searchInput.value?.focus();
  }
};
onMounted(() => {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (Object.prototype.hasOwnProperty.call(SEARCH_ENGINES, saved)) engine.value = saved;
    else if (saved) window.localStorage.setItem(storageKey, "google");
  } catch { /* Private mode */ }
  window.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped lang="scss">
.quick-search {
  position: relative;
  z-index: 2;
  min-height: 62px;
  padding: 10px 17px;
  display: flex;
  align-items: center;
  gap: 13px;
  background: rgb(13 22 34 / 28%);
  transition: border-color .2s, background .2s, box-shadow .2s;

  .search-icon { opacity: .88; width: 22px; height: 22px; flex-shrink: 0; }
  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    border-radius: 0;
    outline: none;
    box-shadow: none;
    font: inherit;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    &::placeholder { color: rgb(255 255 255 / 70%); }
    &:focus, &:focus-visible { outline: none; box-shadow: none; }
  }
  &:focus-within {
    border-color: rgb(255 255 255 / 40%);
    background: rgb(12 22 34 / 52%);
    box-shadow: 0 10px 36px rgb(0 0 0 / 10%), 0 0 0 1px rgb(255 255 255 / 9%);
  }

  .engine-actions {
    display: flex;
    align-items: center;
    gap: 5px;
    flex: none;
    padding-left: 11px;
    border-left: 1px solid rgb(255 255 255 / 20%);
  }
  .engine-button {
    width: 38px;
    height: 38px;
    flex: none;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: rgb(255 255 255 / 64%);
    cursor: pointer;
    transition: background .18s, border-color .18s, color .18s;
    .mono-icon { width: 22px; height: 22px; }
    &:hover { background: rgb(255 255 255 / 11%); color: #fff; }
    &:focus-visible { outline: 2px solid rgb(255 255 255 / 70%); outline-offset: 2px; }
    &.is-selected {
      background: rgb(255 255 255 / 16%);
      border-color: rgb(255 255 255 / 15%);
      color: #fff;
    }
    &.is-selected:hover { background: rgb(255 255 255 / 22%); }
  }
  @media (max-width: 400px) {
    gap: 8px;
    padding: 10px;
    .search-icon { width: 20px; height: 20px; }
    .engine-actions { padding-left: 7px; gap: 3px; }
    .engine-button {
      width: 33px;
      height: 34px;
      border-radius: 9px;
      .mono-icon { width: 20px; height: 20px; }
    }
  }
}
</style>
