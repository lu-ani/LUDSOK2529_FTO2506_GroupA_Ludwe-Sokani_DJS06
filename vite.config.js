import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:
    process.env.VITE_BASE_PATH ||
    "/LUDSOK2529_FTO2506_GroupA_Ludwe-Sokani_DJS06",
});
