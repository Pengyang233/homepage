<template>
  <Teleport to="body">
    <div class="bookmark-backdrop" @mousedown.self="$emit('close')">
      <section class="bookmark-dialog" role="dialog" aria-modal="true" aria-label="管理常用网址">
        <header>
          <h2>管理常用网址</h2>
          <button type="button" aria-label="关闭管理" @click="$emit('close')"><MonoIcon name="x" /></button>
        </header>
        <p class="hint">只保存到本浏览器，不会同步到 GitHub 仓库。</p>
        <div class="existing">
          <div v-for="(item, index) in draft" :key="index" class="bookmark-row">
            <MonoIcon :name="item.icon" />
            <span :title="item.link">{{ item.name }}</span>
            <button type="button" :disabled="index === 0" :aria-label="`上移 ${item.name}`" @click="move(index, -1)"><MonoIcon name="up" /></button>
            <button type="button" :disabled="index === draft.length - 1" :aria-label="`下移 ${item.name}`" @click="move(index, 1)"><MonoIcon name="down" /></button>
            <button type="button" :aria-label="`删除 ${item.name}`" @click="draft.splice(index, 1)"><MonoIcon name="x" /></button>
          </div>
        </div>
        <form class="add-row" @submit.prevent="add">
          <input v-model="newName" aria-label="网址名称" placeholder="名称" maxlength="28" required />
          <input v-model="newUrl" aria-label="网址地址" placeholder="https://example.com" maxlength="2048" required />
          <select v-model="newIcon" aria-label="网址图标">
            <option v-for="icon in BOOKMARK_ICONS" :key="icon" :value="icon">{{ icon }}</option>
          </select>
          <button type="submit">添加</button>
        </form>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <footer>
          <button type="button" class="reset" @click="reset">恢复预设</button>
          <button type="button" class="save" @click="$emit('save', draft)">保存更改</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import MonoIcon from "@/components/MonoIcon.vue";
import { normalizeBookmark, BOOKMARK_ICONS } from "@/utils/bookmarks.js";

const props = defineProps({
  items: { type: Array, required: true },
  defaults: { type: Array, required: true }
});
const emit = defineEmits(["close", "save"]);
const draft = ref(props.items.map(item => ({ ...item })));
const newName = ref("");
const newUrl = ref("");
const newIcon = ref("link");
const error = ref("");
const move = (index, offset) => {
  const next = index + offset;
  if (next < 0 || next >= draft.value.length) return;
  [draft.value[index], draft.value[next]] = [draft.value[next], draft.value[index]];
};
const add = () => {
  if (draft.value.length >= 40) { error.value = "最多保存 40 个网址。"; return; }
  const normalized = normalizeBookmark({ name: newName.value, link: newUrl.value, icon: newIcon.value });
  if (!normalized) { error.value = "请输入有效的 http(s) 网址。"; return; }
  draft.value.push(normalized);
  error.value = "";
  newName.value = "";
  newUrl.value = "";
};
const reset = () => { draft.value = props.defaults.map(item => ({ ...item })); error.value = ""; };
const keydown = (event) => { if (event.key === "Escape") emit("close"); };
onMounted(() => window.addEventListener("keydown", keydown));
onBeforeUnmount(() => window.removeEventListener("keydown", keydown));
</script>

<style scoped lang="scss">
.bookmark-backdrop {
  position: fixed; inset: 0; background: rgb(3 9 17 / 76%); backdrop-filter: blur(12px);
  z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 18px;
}
.bookmark-dialog {
  width: min(620px, 100%); max-height: 86dvh; overflow-y: auto; border-radius: 18px;
  background: #182233; border: 1px solid rgb(255 255 255 / 18%); padding: 24px;
  font-size: 14px; font-weight: 500;
  box-shadow: 0 25px 70px rgb(0 0 0 / 30%);
  header, footer { display: flex; justify-content: space-between; align-items: center; }
  h2 { font-size: 20px; font-weight: 600; }
  .hint { font-size: 14px; color: #d1d9e4; margin: 10px 0 20px; }
  button { cursor: pointer; color: #fff; }
  button:disabled { cursor: default; opacity: .3; }
  button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid white; outline-offset: 2px; }
  header button { border: 0; background: transparent; }
  .existing { max-height: 35dvh; overflow: auto; display: grid; gap: 5px; }
  .bookmark-row {
    display: flex; align-items: center; gap: 12px; padding: 9px 10px;
    background: rgb(255 255 255 / 5%); border-radius: 9px;
    >span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    button { border: 0; border-radius: 6px; background: rgb(255 255 255 / 9%); padding: 5px; }
    button .mono-icon { width: 15px; height: 15px; }
  }
  .add-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
  input, select { background: #273448; color: white; border: 1px solid #445066; padding: 10px; border-radius: 8px; }
  .add-row input:first-child { width: 96px; }
  .add-row input:nth-child(2) { flex: 1; min-width: 145px; }
  .add-row button { padding: 9px 14px; border: 0; border-radius: 8px; background: #465772; }
  .error { color: #ffd0d0; margin-top: 8px; font-size: 13px; }
  footer { gap: 12px; margin-top: 26px; }
  footer button { padding: 10px 14px; border-radius: 8px; border: 1px solid #4a5667; background: transparent; }
  footer .save { border-color: transparent; color: #142033; background: #edf4fc; font-weight: 600; }
  @media (max-width: 480px) { padding: 16px; .bookmark-row { gap: 7px; } }
}
</style>
