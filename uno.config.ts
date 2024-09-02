// unocss.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetScrollbar({}),
    presetIcons({
      collections: {
        systemUicons: () => import('@iconify-json/system-uicons/icons.json').then((i) => i.default)
      }
    })
  ],
})