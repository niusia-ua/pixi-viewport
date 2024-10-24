/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const globals = {
    'pixi.js': 'PIXI',
    '@pixi/core': 'PIXI',
    '@pixi/display': 'PIXI',
    '@pixi/events': 'PIXI',
    '@pixi/math': 'PIXI',
    '@pixi/ticker': 'PIXI',
};

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'pixi_viewport',
            fileName: 'pixi_viewport',
        },
        rollupOptions: {
            external: Object.keys(globals),
            output: { globals },
        },
    },
    test: {
        browser: {
            enabled: true,
            headless: true,
            provider: 'webdriverio',
            name: 'chrome',
            screenshotFailures: false
        },
    },
});
