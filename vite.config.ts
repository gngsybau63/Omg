import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5000,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.DISCORD_WEBHOOK_URL': JSON.stringify(env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1451523340698259509/RTxIlA5rJ4UWqu7TdTZ6q1BkXWI8SNKVomOYPVBk_hmr43f5zRp70hPGadeXUQ80AGVb')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
