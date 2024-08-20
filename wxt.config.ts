import { defineConfig } from 'wxt';
import UnoCSS from 'unocss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  runner: {
    startUrls: ["https://baidu.com/"],
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
      if (names.includes("content") || names.includes("popup")) config.plugins!.push(UnoCSS());
    },
    "vite:devServer:extendConfig": (config) => {
      config.plugins!.push(UnoCSS());
    },
  },
});
