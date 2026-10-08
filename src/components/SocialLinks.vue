<template>
  <nav class="social" aria-label="个人链接与联系方式">
    <div class="link">
      <a v-for="item in socialLinks" :key="item.name" :href="item.url"
        target="_blank" rel="noopener noreferrer" :aria-label="item.name" :title="item.tip">
        <MonoIcon :name="item.name.toLowerCase().includes('github') ? 'github' : 'link'" />
      </a>
      <a v-if="email" :href="'mailto:' + email" aria-label="邮件联系" title="发送邮件">
        <MonoIcon name="mail" />
      </a>
    </div>
  </nav>
</template>

<script setup>
import socialLinks from "@/assets/socialLinks.json";
import MonoIcon from "@/components/MonoIcon.vue";
const email = (import.meta.env.VITE_CONTACT_EMAIL || "").trim();
</script>

<style scoped lang="scss">
.social { margin-top: 16px; width: 100%; max-width: 460px; }
.link { display: flex; align-items: center; justify-content: center; gap: 14px; }
.link a {
  width: 46px; height: 46px; display: grid; place-items: center;
  border: 1px solid rgb(255 255 255 / 23%); border-radius: 12px;
  background: rgb(255 255 255 / 7%); color: #fff;
  transition: background .2s, transform .2s;
  .mono-icon { width: 24px; height: 24px; }
  &:hover { background: rgb(255 255 255 / 20%); transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid white; outline-offset: 2px; }
}
@media (max-width: 720px) { .link { justify-content: center; } }
</style>
