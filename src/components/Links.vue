<template>
  <section class="links cards" aria-label="常用网址">
    <div class="links-header">
      <h2>常用网址</h2>
      <button type="button" aria-label="管理常用网址" @click="editing = true">
        <MonoIcon name="edit" /><span>管理</span>
      </button>
    </div>
    <div v-if="links.length" class="links-grid">
      <a v-for="item in links" :key="item.link + item.name" :href="item.link"
        target="_blank" rel="noopener noreferrer" :title="item.name">
        <span class="icon-frame"><MonoIcon :name="item.icon" /></span>
        <span class="link-name">{{ item.name }}</span>
      </a>
    </div>
    <p v-else class="empty">还没有常用网址，点击「管理」添加。</p>
    <BookmarkEditor v-if="editing" :items="links" :defaults="defaults" @close="editing = false" @save="save" />
  </section>
</template>

<script setup>
import MonoIcon from "@/components/MonoIcon.vue";
import BookmarkEditor from "@/components/BookmarkEditor.vue";
import initialLinks from "@/assets/siteLinks.json";
import { loadBookmarks, saveBookmarks, normalizeBookmark } from "@/utils/bookmarks.js";

const defaults = initialLinks.map(normalizeBookmark).filter(Boolean);
const links = ref(defaults);
const editing = ref(false);
const save = (items) => {
  links.value = saveBookmarks(window.localStorage, items);
  editing.value = false;
};
onMounted(() => { links.value = loadBookmarks(window.localStorage, defaults); });
</script>

<style scoped lang="scss">
.links {
  padding: 23px 25px 24px;
  min-height: 250px;
  background: rgb(13 22 34 / 33%);
  .links-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
    h2 { font-size: clamp(17px, 1vw, 19px); font-weight: 650; letter-spacing: .02em; }
    button {
      display: flex; align-items: center; gap: 6px; border: 0; background: transparent; color: #dce5f0;
      padding: 5px 3px; cursor: pointer; font-size: 14px; font-weight: 550; opacity: .9;
      .mono-icon { width: 15px; height: 15px; }
      &:hover { opacity: 1; }
      &:focus-visible { outline: 2px solid #fff; }
    }
  }
  .links-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 17px 12px; }
  .links-grid a {
    min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 9px;
    text-decoration: none; border-radius: 10px; padding: 4px 2px 7px;
    &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    &:hover .icon-frame { background: rgb(255 255 255 / 21%); transform: translateY(-3px); }
    .icon-frame {
      width: 56px; height: 56px; display: grid; place-items: center; border-radius: 14px;
      border: 1px solid rgb(255 255 255 / 20%); background: rgb(255 255 255 / 11%);
      transition: background .2s,transform .2s;
      .mono-icon { width: 29px; height: 29px; }
    }
    .link-name { font-size: clamp(14px, .85vw, 16px); font-weight: 600; line-height: 1.35; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
  .empty { color: rgb(255 255 255 / 85%); font-size: 14px; font-weight: 500; margin-top: 30px; }
  @media (max-width: 410px) {
    padding: 18px 12px;
    .links-grid { gap: 13px 4px; }
    .links-grid a .icon-frame { width: 46px; height: 46px; }
    .links-grid a .icon-frame .mono-icon { width: 25px; height: 25px; }
    .links-grid a .link-name { font-size: 13px; }
  }
}
</style>
