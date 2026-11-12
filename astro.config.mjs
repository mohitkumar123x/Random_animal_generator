// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

function pexelsDevProxy() {
  return {
    name: 'pexels-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/pexels', async (req, res) => {
        try {
          const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const query = parsedUrl.searchParams.get('query');
          if (!query) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Query parameter is required' }));
            return;
          }
          const apiKey = process.env.PEXELS_API_KEY || 'xEfnJ9xU5Fem8MeEPh1zE3lURDVneBkLnPGnrNAjnbMCBAY0LGtdgLFE';
          const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
            headers: { Authorization: apiKey },
          });
          res.statusCode = pexelsRes.status;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          const data = await pexelsRes.text();
          res.end(data);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    },
  };
}

export default defineConfig({
  site: 'https://bestrandomanimalgenerator.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        const excludedPaths = [
          '/api/',
        ];
        return !excludedPaths.some((path) => page.includes(path));
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss(), pexelsDevProxy()],
  },
});