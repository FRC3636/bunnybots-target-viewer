import { defineConfig } from "astro/config";
import { VitePWA } from "vite-plugin-pwa";
import { manifest } from "./utils/seo";
import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), tailwind()],
    site: "https://frc3636.github.io/bunnybots-target-viewer",
    base: "/bunnybots-target-viewer",
    vite: {
        plugins: [
            VitePWA({
                manifest,
            }),
        ],
    },
});
