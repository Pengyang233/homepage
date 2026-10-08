/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          // VitePWA precaches versioned build assets; avoid CacheFirst for generic JS/CSS URLs.
          runtimeCaching: [
            {
              urlPattern: /\\.(?:png|jpe?g|svg|gif|webp)$/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "image-cache-v2",
                expiration: { maxEntries: 40, maxAgeSeconds: 7 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        manifest: {
          name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          short_name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          description: loadEnv(mode, process.cwd()).VITE_SITE_DES,
          display: "standalone",
          start_url: "/",
          theme_color: "#424242",
          background_color: "#424242",
          icons: [
            {
              src: "/images/icon/perrin-48.png",
              sizes: "48x48",
              type: "image/png",
            },
            {
              src: "/images/icon/perrin-72.png",
              sizes: "72x72",
              type: "image/png",
            },
            {
              src: "/images/icon/perrin-96.png",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "/images/icon/perrin-128.png",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "/images/icon/perrin-144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "/images/icon/perrin-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/images/icon/perrin-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      viteCompression(),
    ],
    server: {
      port: "3000",
      open: true,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "./src/style/global.scss" as *;`,
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
    },
  });
