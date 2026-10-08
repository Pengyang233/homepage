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

壁纸固定使用 `public/images/background1.jpg`；图片加载失败时显示深色背景，主页仍能正常进入。一言 API 请求超时或失败时显示本地文案。外部字体源已取消引用，浏览器使用本地/系统字体回退。加载动画支持系统减少动态效果设置。

## CI

`.github/workflows/build.yml` 在 push 到 `dev` / `master`、PR 和手动触发时运行 `npm ci`、只读的 `npm run lint:check` 与 `npm run build`；不会自动发布网站，也不需要额外 Token。

## 手动验收建议

使用 320、375、390、720 和 1280px 等视口检查是否有横向滚动；尝试右键菜单、键盘 Tab 访问导航、点击外部链接；在浏览器开发者工具中模拟离线/慢网络，确认壁纸、一言失败时主页仍显示。


## 浏览器冒烟测试

`tests/browser/homepage.spec.mjs` 覆盖窄屏横向滚动、博客链接、固定壁纸、旧浏览器偏好失效与设置入口关闭。PR 会运行独立的 **Browser Smoke** GitHub Actions 工作流（Chromium），失败时上传 trace / 测试报告。

本地复现：

```bash
npm ci
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
npx playwright test --config=playwright.config.mjs
```

`npm test` 运行时间胶囊及防抖单元测试；`npm run lint:check` 和 `npm run build` 验证代码质量与构建。

## 依赖审查记录

检查当前 `src/` 和 `vite.config.js` 的直接引用后，`axios` 与 `lodash-es` **未发现直接使用**。暂不直接修改依赖及锁文件，以免在没有完成完整 npm 安装与构建验证时产生锁文件不一致；待确认构建检查通过后，可用 `npm uninstall axios lodash-es` 同步更新 `package.json` 和 `package-lock.json`。

## 致谢

本站基于 [imsyy/home](https://github.com/imsyy/home) 二次开发。感谢原作者 imsyy 开源原项目；保留原始许可证及版权信息。

## 私人起始页

主页保留原版 `perrin` 字标（`Pacifico-Regular`）与头像 `public/images/icon/perrin-logo.png`，采用轻量双栏与黑白单色图标（网站使用品牌剪影，功能按钮使用较清晰的线性图标）。主体使用系统字体栈，提升大屏可读性；`perrin` 签名字体仍为 `Pacifico-Regular`。

- **图标**：GitHub、ChatGPT、Cloudflare、Google、Bilibili 的单色品牌图形参考 [Simple Icons](https://simpleicons.org/)（CC0），已内联至本地组件，不依赖第三方图标 CDN。网址展示直接读取仓库配置。
- **搜索**：右侧输入框支持关键词（Google / Bing / DuckDuckGo）和直接访问网址；按 `/` 或 `Ctrl/⌘+K` 聚焦。
- **固定网址**：统一读取 `src/assets/siteLinks.json`，不再提供浏览器侧编辑入口，也不读取历史本地书签。调整网址请修改配置后重新发布，原 `BookmarkEditor.vue` 代码保留。
- **天气**：点击天气区域主动搜索城市或授权浏览器定位；使用 Open-Meteo 地理编码与天气 API，失败时显示降级提示，不会阻塞页面加载。所选坐标保存在浏览器本地。也可通过 `.env` 中 `VITE_WEATHER_CITY`、`VITE_WEATHER_LATITUDE`、`VITE_WEATHER_LONGITUDE` 配置默认城市。**注意：选择城市或定位后，坐标会发送至 Open-Meteo 服务**，不会自动请求浏览器定位权限。
- **联系邮箱**：设置 `VITE_CONTACT_EMAIL` 才会显示邮件按钮。此字段会编译到公开网页中，不适合放私人邮箱；留空即可。
- **壁纸与设置**：固定使用 `public/images/background1.jpg`；全局设置入口及页面暂时关闭，保留 `MoreSet` 与 `Set.vue` 源码。

天气城市和搜索引擎偏好继续保存在浏览器本地；固定网址和壁纸在所有设备上相同。仓库公开，请勿提交私人服务 Token、内网管理地址或包含敏感查询参数的网址。
