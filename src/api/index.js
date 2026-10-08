/** 一言：外部服务超时或异常时由调用方显示本地文案。 */
export const getHitokoto = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch("https://v1.hitokoto.cn", { signal: controller.signal });
    if (!response.ok) throw new Error(`Hitokoto API: ${response.status}`);
    const data = await response.json();
    if (typeof data.hitokoto !== "string" || !data.hitokoto.trim()) throw new Error("Invalid Hitokoto response");
    return data;
  } finally {
    clearTimeout(timeout);
  }
};
