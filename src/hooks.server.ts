import { env } from '$env/dynamic/private';
import { authClient } from '$lib/auth-client';
import { paraglideMiddleware } from '$lib/paraglide/server';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: event.request.headers
		}
	});

	event.locals.session = session?.data?.session;
	event.locals.user = session?.data?.user;

	return resolve(event);
};

const handleFetch: Handle = async ({ event, resolve }) => {
	console.log('Fetch URL:', event.request.url);
	if (event.request.url.includes(env.BAAS_API_URL)) {
		// 將原始請求的所有 Cookie 轉發給內部的 API
		const cookie = event.request.headers.get('cookie');
		if (cookie) {
			event.request.headers.set('cookie', cookie);
		}
	}
	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, handleFetch);
