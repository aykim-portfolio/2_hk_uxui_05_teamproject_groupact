import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const buildId = Date.now().toString(36)

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // 빌드 산출물을 루트/서브패스 어디에 올려도 정적 자산 경로가 유지된다.
  base: './',
  define: {
    __PAPERTORY_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // viewport/safe-area 구형 fallback 선언 순서를 CSS 압축기가 제거하지 않게 유지한다.
    cssMinify: false,
    // 서비스 워커가 해시된 이미지·CSS·JS까지 오프라인 캐시에 포함할 수 있게 한다.
    manifest: 'asset-manifest.json',
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
