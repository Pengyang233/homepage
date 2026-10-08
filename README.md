# perrin's homepage

简体中文 | [English](./README_EN.md)

个人主页与常用链接入口，基于 Vue 3、Vite 和 Pinia 构建。

- 主页：[hyperrin.com](https://hyperrin.com)
- 博客：[blog.hyperrin.com](https://blog.hyperrin.com)
- GitHub：[Pengyang233](https://github.com/Pengyang233)

## 本地开发

推荐 Node.js 20；使用 npm（仓库维护 `package-lock.json`）。

```bash
npm ci
cp .env.example .env
npm run dev
```

Windows 可手动复制 `.env.example` 为 `.env`。构建前可运行：

```bash
npm run lint:check
npm run build
npm run preview
```

## 自定义

- 站点标题、介绍、域名：`.env`（参考 `.env.example`）
- 网站导航：`src/assets/siteLinks.json`
- 社交链接：`src/assets/socialLinks.json`
- 头像和网站图标：`public/images/icon/`
- 本地壁纸：`public/images/background1.jpg` 至 `background10.jpg`

`.env` 已由 Git 忽略；但 **VITE_ 前缀变量可能被编译进前端资源，不适合存放私钥**。

## 页面可用性与降级

默认壁纸使用本地图片；选择第三方壁纸时，加载失败或超时会回退到本地壁纸，若图片仍不可用，页面显示深色背景并正常进入主页。一言 API 请求超时或失败时显示本地文案。外部字体源已取消引用，浏览器使用本地/系统字体回退。加载动画支持系统减少动态效果设置。

## CI

`.github/workflows/build.yml` 在 push 到 `dev` / `master`、PR 和手动触发时运行 `npm ci`、只读的 `npm run lint:check` 与 `npm run build`；不会自动发布网站，也不需要额外 Token。

## 手动验收建议

使用 320、375、390、720 和 1280px 等视口检查是否有横向滚动；尝试右键菜单、键盘 Tab 访问导航、点击外部链接；在浏览器开发者工具中模拟离线/慢网络，确认壁纸、一言失败时主页仍显示。

## 致谢

本站基于 [imsyy/home](https://github.com/imsyy/home) 二次开发。感谢原作者 imsyy 开源原项目；保留原始许可证及版权信息。
