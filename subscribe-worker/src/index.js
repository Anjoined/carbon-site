/**
 * Carbon Simple — Subscribe Worker
 *
 * Handles email subscriptions via Cloudflare Workers + KV.
 *
 * Endpoints:
 *   POST /subscribe   — Add email to subscriber list
 *   GET  /subscribers — List subscribers (requires ?token=ADMIN_TOKEN)
 *
 * Environment variables:
 *   SUBSCRIBERS — KV namespace binding
 *   ADMIN_TOKEN — (optional) Token for admin access to /subscribers
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

const ALLOWED_ORIGINS = [
    'https://carbon-simple.pages.dev',
    'http://localhost:3000',
    'http://localhost:8080',
];

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
        },
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleSubscribe(request, env) {
    try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();

        if (!email) {
            return jsonResponse({ error: 'Email is required.' }, 400);
        }

        if (!isValidEmail(email)) {
            return jsonResponse({ error: 'Invalid email format.' }, 400);
        }

        // Check if already subscribed
        const existing = await env.SUBSCRIBERS.get(email);
        if (existing) {
            return jsonResponse({ message: 'Already subscribed.' }, 200);
        }

        // Store subscriber
        await env.SUBSCRIBERS.put(email, JSON.stringify({
            subscribed_at: new Date().toISOString(),
            source: 'website',
        }));

        return jsonResponse({ message: 'Subscribed successfully!' }, 201);
    } catch (err) {
        return jsonResponse({ error: 'Invalid request body.' }, 400);
    }
}

async function handleListSubscribers(request, env) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    // Simple token auth for admin access
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return jsonResponse({ error: 'Unauthorized.' }, 401);
    }

    const list = await env.SUBSCRIBERS.list();
    const subscribers = [];

    for (const key of list.keys) {
        const value = await env.SUBSCRIBERS.get(key.name);
        subscribers.push({
            email: key.name,
            ...JSON.parse(value || '{}'),
        });
    }

    return jsonResponse({ count: subscribers.length, subscribers });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: CORS_HEADERS,
            });
        }

        // POST /subscribe
        if (url.pathname === '/subscribe' && request.method === 'POST') {
            return handleSubscribe(request, env);
        }

        // GET /subscribers (admin)
        if (url.pathname === '/subscribers' && request.method === 'GET') {
            return handleListSubscribers(request, env);
        }

        return jsonResponse({ error: 'Not found.' }, 404);
    },
};
