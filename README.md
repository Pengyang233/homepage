# Perrin's Homepage

[简体中文](./README.md) | [English](./README_EN.md)

**在线预览：** [hyperrin.com](https://hyperrin.com/)

## 功能特性

- 简洁的响应式布局，适配桌面及移动设备
- 集成搜索、快捷导航与常用功能
- 支持天气查询、每日一句及本地壁纸
- 支持基础个性化配置及异常情况下的页面降级

## 本地开发

推荐使用 Node.js 20 和 npm。

```bash
npm ci
cp .env.example .env
npm run dev
```

构建项目：`npm run build`。

## 自定义配置

- `.env` — 站点基础信息
- `src/assets/siteLinks.json` — 快捷导航
- `src/assets/socialLinks.json` — 社交链接
- `public/images/` — 图标与背景资源

请勿将密钥、Token 或其他敏感信息写入公开配置或前端环境变量。

## 致谢与许可

本项目基于 [imsyy/home](https://github.com/imsyy/home) 二次开发，感谢原作者的开源贡献。

项目遵循 [MIT License](./LICENSE)。
