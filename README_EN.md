# Perrin's Homepage

[简体中文](./README.md) | [English](./README_EN.md)

**Live site:** [hyperrin.com](https://hyperrin.com/)

## Features

- Responsive layout for desktop and mobile
- Built-in search, quick navigation, and useful shortcuts
- Weather lookup, daily quotes, and bundled wallpapers
- Basic personalization and graceful fallbacks when resources fail

## Development

Node.js 20 and npm are recommended.

```bash
npm ci
cp .env.example .env
npm run dev
```

Build for production: `npm run build`.

## Configuration

- `.env` — Site metadata
- `src/assets/siteLinks.json` — Quick links
- `src/assets/socialLinks.json` — Social links
- `public/images/` — Icons and background assets

Never commit secrets, tokens, or other sensitive information to public configuration or frontend environment variables.

## Credits & License

Based on [imsyy/home](https://github.com/imsyy/home). Thanks to the original author for the open-source project.

Licensed under the [MIT License](./LICENSE).
