<template>
  <form class="quick-search cards" role="search" @submit.prevent="submit">
    <MonoIcon name="search" />
    <input ref="searchInput" v-model="query" aria-label="搜索网页或输入网址"
      placeholder="搜索网页，或输入网址…" autocomplete="off" spellcheck="false" />
    <label class="engine-select">
      <span class="sr-only">搜索引擎</span>
      <select v-model="engine" aria-label="搜索引擎">
        <option value="google">Google</option>
        <option value="bing">Bing</option>
        <option value="duckduckgo">DuckDuckGo</option>
      </select>
    </label>
    <button type="submit" aria-label="开始搜索"><span>↗</span></button>
  </form>
</template>

<script setup>
import MonoIcon from "@/components/MonoIcon.vue";
import { resolveNavigation, SEARCH_ENGINES } from "@/utils/quickSearch.js";

const query = ref("");
const searchInput = ref(null);
const engine = ref("google");
const storageKey = "perrin-search-engine-v1";

watch(engine, (value) => {
  try { window.localStorage.setItem(storageKey, value); } catch { /* Private mode */ }
});

const submit = () => {
  const destination = resolveNavigation(query.value, engine.value);
  if (destination) window.location.assign(destination);
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
  } catch { /* Private mode */ }
  window.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => window.removeEventListener("keydown", handleKeydown));
</script>

<style scoped lang="scss">
.quick-search {
  min-height: 62px;
  padding: 10px 17px;
  display: flex;
  align-items: center;
  gap: 13px;
  background: rgb(13 22 34 / 28%);
  .mono-icon { opacity: .85; width: 22px; height: 22px; }
  input {
    flex: 1; min-width: 0; background: transparent; border: 0; outline: 0;
    font: inherit; font-size: 16px; font-weight: 500; color: #fff;
    &::placeholder { color: rgb(255 255 255 / 70%); }
  }
  &:focus-within { border-color: rgb(255 255 255 / 46%); background: rgb(12 22 34 / 52%); }
  .engine-select {
    border-left: 1px solid rgb(255 255 255 / 20%); padding-left: 10px;
    select { width: 93px; max-width: 24vw; color: #e8ecf2; background: transparent; border: 0; font-size: 13px; font-weight: 600; cursor: pointer; }
    option { color: #222; }
  }
  button { border: 0; background: rgb(255 255 255 / 12%); color: #fff; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; font-size: 19px; font-weight: 600; }
  button:hover { background: rgb(255 255 255 / 22%); }
  button:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  @media (max-width: 400px) { gap: 8px; padding: 10px; .engine-select select { width: 65px; } }
}
</style>
