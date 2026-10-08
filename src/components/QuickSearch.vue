<template>
  <form class="quick-search cards" role="search" @submit.prevent="submit">
    <MonoIcon name="search" class="search-icon" />
    <input ref="searchInput" v-model="query" aria-label="搜索网页或输入网址"
      placeholder="搜索网页，或输入网址…" autocomplete="off" spellcheck="false" />
    <div ref="engineSelect" class="engine-select" @keydown="handleEngineKeydown" @focusout="handleEngineFocusOut">
      <button ref="engineTrigger" class="engine-trigger" type="button" aria-label="搜索引擎"
        aria-haspopup="listbox" aria-controls="search-engine-options" :aria-expanded="engineOpen"
        @click="toggleEngineMenu">
        <span class="engine-label">{{ selectedEngineLabel }}</span>
        <MonoIcon name="down" class="engine-chevron" />
      </button>
      <div v-if="engineOpen" id="search-engine-options" ref="engineMenu"
        class="engine-menu" role="listbox" aria-label="选择搜索引擎">
        <button v-for="option in engineOptions" :key="option.value" type="button"
          role="option" class="engine-option" :class="{ 'is-selected': engine === option.value }"
          :aria-selected="engine === option.value" @click="chooseEngine(option.value)">
          <span>{{ option.label }}</span>
          <MonoIcon v-if="engine === option.value" name="check" />
        </button>
      </div>
    </div>
    <button class="submit-button" type="submit" aria-label="开始搜索">
      <MonoIcon name="arrowUpRight" />
    </button>
  </form>
</template>

<script setup>
import MonoIcon from "@/components/MonoIcon.vue";
import { resolveNavigation, SEARCH_ENGINES } from "@/utils/quickSearch.js";

const engineOptions = [
  { value: "google", label: "Google" },
  { value: "bing", label: "Bing" },
  { value: "duckduckgo", label: "DuckDuckGo" },
];
const query = ref("");
const searchInput = ref(null);
const engine = ref("google");
const engineOpen = ref(false);
const engineSelect = ref(null);
const engineTrigger = ref(null);
const engineMenu = ref(null);
const selectedEngineLabel = computed(() => engineOptions.find(option => option.value === engine.value)?.label ?? "Google");
const storageKey = "perrin-search-engine-v1";

watch(engine, (value) => {
  try { window.localStorage.setItem(storageKey, value); } catch { /* Private mode */ }
});

const submit = () => {
  const destination = resolveNavigation(query.value, engine.value);
  if (destination) window.location.assign(destination);
};

const focusEngineOption = (index) => nextTick(() => {
  engineMenu.value?.querySelectorAll('[role="option"]')[index]?.focus();
});
const openEngineMenu = () => {
  engineOpen.value = true;
  focusEngineOption(Math.max(0, engineOptions.findIndex(option => option.value === engine.value)));
};
const closeEngineMenu = (restoreFocus = false) => {
  engineOpen.value = false;
  if (restoreFocus) nextTick(() => engineTrigger.value?.focus());
};
const toggleEngineMenu = () => {
  if (engineOpen.value) closeEngineMenu();
  else openEngineMenu();
};
const chooseEngine = (value) => {
  engine.value = value;
  closeEngineMenu(true);
};
const handleEngineKeydown = (event) => {
  if (event.key === "Escape" && engineOpen.value) {
    event.preventDefault();
    event.stopPropagation();
    closeEngineMenu(true);
    return;
  }
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  if (!engineOpen.value) {
    openEngineMenu();
    return;
  }
  const options = Array.from(engineMenu.value?.querySelectorAll('[role="option"]') || []);
  const activeIndex = options.indexOf(document.activeElement);
  const index = activeIndex < 0
    ? Math.max(0, engineOptions.findIndex(option => option.value === engine.value))
    : activeIndex;
  const next = event.key === "Home" ? 0
    : event.key === "End" ? options.length - 1
    : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
  focusEngineOption(next);
};
const handleEngineFocusOut = (event) => {
  if (!engineSelect.value?.contains(event.relatedTarget)) closeEngineMenu();
};
const handleOutsidePointerDown = (event) => {
  if (!engineSelect.value?.contains(event.target)) closeEngineMenu();
};
const handleKeydown = (event) => {
  const target = event.target;
  const editing = target instanceof HTMLElement &&
    (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);
  if (editing || event.altKey) return;
  if (event.key === "/" || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
    event.preventDefault();
    closeEngineMenu();
    searchInput.value?.focus();
  }
};
onMounted(() => {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (Object.prototype.hasOwnProperty.call(SEARCH_ENGINES, saved)) engine.value = saved;
  } catch { /* Private mode */ }
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("pointerdown", handleOutsidePointerDown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("pointerdown", handleOutsidePointerDown);
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

  .engine-select {
    position: relative;
    flex: none;
    border-left: 1px solid rgb(255 255 255 / 20%);
    padding-left: 9px;
  }
  .engine-trigger {
    width: 117px;
    min-height: 36px;
    padding: 0 8px 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: rgb(255 255 255 / 88%);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background .18s, border-color .18s;
    &:hover, &[aria-expanded="true"] { background: rgb(255 255 255 / 10%); }
    &:focus-visible { outline: none; border-color: rgb(255 255 255 / 48%); }
    .engine-label { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    .engine-chevron { width: 15px; height: 15px; flex-shrink: 0; opacity: .8; transition: transform .18s; }
    &[aria-expanded="true"] .engine-chevron { transform: rotate(180deg); }
  }
  .engine-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 5;
    width: 190px;
    padding: 6px;
    border: 1px solid rgb(255 255 255 / 18%);
    border-radius: 14px;
    background: rgb(21 33 49 / 96%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 14px 38px rgb(0 0 0 / 28%);
  }
  .engine-option {
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    color: rgb(255 255 255 / 78%);
    font: inherit;
    font-size: 13px;
    font-weight: 550;
    text-align: left;
    cursor: pointer;
    transition: background .15s, color .15s;
    &:hover, &:focus-visible { outline: none; background: rgb(255 255 255 / 12%); color: #fff; }
    &.is-selected { background: rgb(255 255 255 / 10%); color: #fff; font-weight: 650; }
    &.is-selected:focus-visible { box-shadow: inset 0 0 0 1px rgb(255 255 255 / 35%); }
    .mono-icon { width: 16px; height: 16px; flex-shrink: 0; stroke-width: 2.6; }
  }
  .submit-button {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 10px;
    background: rgb(255 255 255 / 12%);
    color: #fff;
    cursor: pointer;
    transition: background .18s, transform .18s;
    &:hover { background: rgb(255 255 255 / 22%); }
    &:focus-visible { outline: 2px solid rgb(255 255 255 / 65%); outline-offset: 2px; }
    .mono-icon { width: 23px; height: 23px; stroke-width: 2.8; }
  }
  @media (max-width: 400px) {
    gap: 8px;
    padding: 10px;
    .search-icon { width: 20px; height: 20px; }
    .engine-select { padding-left: 6px; }
    .engine-trigger { width: 106px; padding: 0 5px 0 7px; font-size: 12px; gap: 4px; }
    .engine-menu { width: 176px; }
    .submit-button { width: 34px; height: 34px; }
  }
}
</style>
