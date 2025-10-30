import * as dotenv from "dotenv"
import { join } from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig(() => {
    dotenv.config({ path: join(__dirname, ".env.local") })
    dotenv.config({ path: join(__dirname, ".env") })

    return {
        resolve: {
            preserveSymlinks: true,
        },
        server: {
            port: +(process.env.PORT ?? 8080),
            hmr: false,
            /* proxy: {
                "^/api": { target: process.env.BACKEND_URL, changeOrigin: true },
            } */
        },
    }
})
