import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 5179,
      host: "0.0.0.0",
    },
    ssr: {
      noExternal: [],
      external: ["@mysten/sui"],
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});
