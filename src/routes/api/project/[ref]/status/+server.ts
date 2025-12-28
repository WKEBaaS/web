import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	// 1. 建構外部 BAAS 的 URL
	const targetUrl = new URL('/v1/project/status', env.BAAS_API_URL);
	targetUrl.searchParams.set('ref', event.params.ref);

	try {
		// 2. 呼叫外部 API
		// 注意：如果你需要轉送使用者的 Auth Token 或 Cookie，要在這裡設定 headers
		const response = await event.fetch(targetUrl, {
			method: 'GET',
			headers: {
				Accept: 'text/event-stream'
			}
		});

		if (!response.ok || !response.body) {
			throw error(response.status, 'Failed to connect to upstream SSE');
		}

		// 3. 建立一個 ReadableStream 來轉發資料
		// 大多數情況下直接回傳 response.body 即可，但為了保險起見，我們明確宣告 header
		const stream = response.body;

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
				// 某些代理伺服器需要這個
				'X-Accel-Buffering': 'no'
			}
		});
	} catch (err) {
		console.error('SSE Proxy Error:', err);
		throw error(500, 'Internal Server Error');
	}
};
