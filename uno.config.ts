// unocss.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetScrollbar({
      // config
    }),
  ],
})