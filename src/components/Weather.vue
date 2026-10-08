<template>
  <div class="weather">
    <button type="button" class="weather-trigger" :aria-label="location ? '更改天气城市' : '设置天气城市'"
      @click="editing = !editing">
      <MonoIcon :name="weatherIcon" />
      <span v-if="current">{{ Math.round(current.temperature_2m) }}° · {{ weatherText }}</span>
      <span v-else>{{ location ? (loading ? "天气加载中…" : "天气暂不可用") : "设置天气城市" }}</span>
      <span class="city">{{ location?.label || "" }}</span>
    </button>
    <div v-if="editing" class="city-picker cards">
      <label for="weather-city">天气城市（不会自动获取位置）</label>
      <div class="city-search">
        <input id="weather-city" v-model.trim="cityQuery" placeholder="例如：上海" maxlength="50"
          @keydown.enter.prevent="searchCity" />
        <button type="button" :disabled="searching || !cityQuery" @click="searchCity">查找</button>
      </div>
      <button type="button" class="use-location" @click="useCurrentLocation">使用浏览器定位</button>
      <div v-if="options.length" class="city-results">
        <button v-for="option in options" :key="option.id" type="button" @click="chooseLocation(option)">
          {{ [option.name, option.admin1, option.country].filter(Boolean).join(" · ") }}
        </button>
      </div>
      <p v-if="error" class="weather-error" role="status">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import MonoIcon from "@/components/MonoIcon.vue";

const STORAGE_KEY = "perrin-weather-location-v1";
const location = ref(null);
const current = ref(null);
const loading = ref(false);
const editing = ref(false);
const searching = ref(false);
const cityQuery = ref("");
const options = ref([]);
const error = ref("");
let intervalId;
let alive = true;

const weatherText = computed(() => {
  if (!current.value) return "";
  const code = current.value.weather_code;
  if (code === 0) return "晴";
  if (code <= 3) return "多云";
  if (code <= 48) return "雾";
  if (code <= 67) return "雨";
  if (code <= 77) return "雪";
  if (code <= 82) return "阵雨";
  if (code <= 86) return "阵雪";
  return "雷雨";
});
const weatherIcon = computed(() => {
  if (!current.value || current.value.weather_code >= 45) return "cloud";
  if (current.value.weather_code >= 2) return "cloudSun";
  return current.value.is_day ? "sun" : "moon";
});

const safeLocation = (candidate) => {
  if (!candidate || typeof candidate !== "object") return null;
  const latitude = Number(candidate.latitude), longitude = Number(candidate.longitude);
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) return null;
  return { latitude, longitude, label: String(candidate.label || "当前位置").slice(0, 35) };
};
const fetchJSON = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timeout); }
};
const refresh = async () => {
  if (!location.value) return;
  const coordinates = location.value;
  loading.value = true;
  try {
    const params = new URLSearchParams({
      latitude: String(coordinates.latitude), longitude: String(coordinates.longitude),
      current: "temperature_2m,weather_code,is_day", timezone: "auto"
    });
    const data = await fetchJSON(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (alive && coordinates === location.value) {
      current.value = Number.isFinite(data.current?.temperature_2m) ? data.current : null;
    }
  } catch {
    if (alive && coordinates === location.value) current.value = null;
  } finally { if (alive) loading.value = false; }
};
const chooseLocation = (option) => {
  const next = safeLocation({ ...option, label: option.label || [option.name, option.admin1].filter(Boolean).join(" · ") });
  if (!next) return;
  location.value = next;
  current.value = null;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage unavailable */ }
  editing.value = false;
  options.value = [];
  error.value = "";
  refresh();
};
const searchCity = async () => {
  if (!cityQuery.value || searching.value) return;
  searching.value = true;
  options.value = [];
  error.value = "";
  try {
    const params = new URLSearchParams({ name: cityQuery.value, count: "5", language: "zh", format: "json" });
    const result = await fetchJSON(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
    if (!alive) return;
    options.value = (result.results || []).filter(safeLocation);
    if (!options.value.length) error.value = "没有找到城市，请更换关键词。";
  } catch {
    if (alive) error.value = "城市查询失败，请稍后重试。";
  } finally { if (alive) searching.value = false; }
};
const useCurrentLocation = () => {
  if (!navigator.geolocation) { error.value = "当前浏览器不支持定位。"; return; }
  error.value = "";
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => { if (alive) chooseLocation({ latitude: coords.latitude, longitude: coords.longitude, label: "当前位置" }); },
    () => { if (alive) error.value = "无法获取位置，可改为搜索城市。"; },
    { timeout: 8000, maximumAge: 3600000 }
  );
};

onMounted(() => {
  let saved = null;
  try { saved = safeLocation(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { /* Empty or invalid */ }
  const latitude = import.meta.env.VITE_WEATHER_LATITUDE;
  const longitude = import.meta.env.VITE_WEATHER_LONGITUDE;
  const configured = latitude && longitude ? safeLocation({
    latitude, longitude, label: import.meta.env.VITE_WEATHER_CITY || "预设城市"
  }) : null;
  location.value = saved || configured;
  if (location.value) refresh();
  intervalId = setInterval(refresh, 30 * 60 * 1000);
});
onBeforeUnmount(() => { alive = false; clearInterval(intervalId); });
</script>

<style scoped lang="scss">
.weather { position: relative; min-width: 0; }
.weather-trigger {
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap; color: #f7f8fc;
  border: none; background: transparent; padding: 6px 0; cursor: pointer;
  font-size: 14px; text-align: left;
  .mono-icon { width: 18px; height: 18px; }
  .city { color: rgb(255 255 255 / 65%); }
  &:focus-visible { outline: 2px solid #fff; border-radius: 4px; }
}
.city-picker {
  position: absolute; right: 0; top: calc(100% + 12px); width: min(310px, 78vw);
  padding: 16px; z-index: 15; background: rgb(18 27 40 / 94%); font-size: 13px;
  label { display: block; margin-bottom: 10px; }
  .city-search { display: flex; gap: 8px; }
  input {
    min-width: 0; flex: 1; padding: 8px; border-radius: 8px; color: #fff;
    border: 1px solid rgb(255 255 255 / 20%); background: rgb(255 255 255 / 10%);
  }
  button { cursor: pointer; color: #fff; }
  .city-search button { background: rgb(255 255 255 / 14%); border: 0; border-radius: 8px; padding: 8px; }
  .use-location { display: block; margin-top: 11px; padding: 4px 0; border: 0; background: transparent; text-decoration: underline; }
  .city-results { display: grid; gap: 3px; margin-top: 10px; }
  .city-results button { text-align: left; background: transparent; border: 0; padding: 9px 4px; border-radius: 5px; }
  .city-results button:hover { background: rgb(255 255 255 / 15%); }
  .weather-error { margin-top: 8px; color: #ffd7bd; }
}
</style>
