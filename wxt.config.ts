import { defineConfig } from 'wxt';
import UnoCSS from 'unocss/vite'

export default defineConfig({
  manifest: {
    action: {},
    page_action: {},
  },
  modules: ['@wxt-dev/module-react'],
  runner: {
    startUrls: ["https://www.tailwindcss.cn/"],
  },
  vite: () => {
    return {
      build: {
        sourcemap: false,
      }
    };
  },
  hooks: {
    "vite:build:extendConfig": (entries, config) => {
      const names = entries.map(entry => entry.name);
      if (names.includes("content")) config.plugins!.push(UnoCSS());
    },
    "vite:devServer:extendConfig": (config) => {
      config.plugins!.push(UnoCSS());
    },
  },
});
