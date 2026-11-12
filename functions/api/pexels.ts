interface Env {
  PEXELS_API_KEY?: string;
}

// Cloudflare Pages Function proxy for Pexels API
// Keeps the secret API key safe on the server and caches images at the Edge CDN
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = context.env.PEXELS_API_KEY || 'xEfnJ9xU5Fem8MeEPh1zE3lURDVneBkLnPGnrNAjnbMCBAY0LGtdgLFE';

  try {
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const response = await fetch(pexelsUrl, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Pexels API error', status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    // Cache responses at Cloudflare Edge CDN for 7 days (604800s) and browser for 1 day (86400s)
    // This dramatically protects monthly quota from repeated queries and scrapers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
