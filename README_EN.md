# perrin's homepage

English | [简体中文](./README.md)

Personal homepage and link hub, built with Vue 3, Vite and Pinia.

- Website: [hyperrin.com](https://hyperrin.com)
- Blog: [blog.hyperrin.com](https://blog.hyperrin.com)
- GitHub: [Pengyang233](https://github.com/Pengyang233)

## Development

Use Node.js 20 and npm:

```bash
npm ci
cp .env.example .env
npm run dev
npm run lint:check
npm run build
```

On Windows, copy `.env.example` to `.env` manually. Configure your site in `.env`, fixed public links in `src/assets/siteLinks.json`, social links in `src/assets/socialLinks.json`, and the fixed wallpaper in `public/images/background1.jpg`. Bookmark editing and global settings are disabled in the public UI; their source components remain available for future reuse.

`VITE_` variables may be exposed in browser bundles; do not put secrets in them.

## Resilience

The wallpaper is fixed to `public/images/background1.jpg`; if it fails to load, a solid background is shown without blocking the homepage. Hitokoto failures show local placeholder text. The site does not require an external font provider. Reduced-motion preferences are respected.

## CI and manual checks

The GitHub Actions workflow runs `npm ci`, `npm run lint:check` and `npm run build` on pushes to dev/master, PRs and manual triggers. It does not deploy the site.

Test narrow mobile widths (320–390px), right-click menu, keyboard-accessible links, and offline/slow-network resource fallbacks.

## Credits

Adapted from [imsyy/home](https://github.com/imsyy/home). Thanks to its original author imsyy; the upstream copyright notices and license remain preserved.
