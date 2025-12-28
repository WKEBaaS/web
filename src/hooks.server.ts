import { env } from '$env/dynamic/private';
import { authClient } from '$lib/auth-client';
import { paraglideMiddleware } from '$lib/paraglide/server';
import type { Handle, HandleFetch } from '@sveltejs/kit';
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

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.includes(env.BAAS_API_URL)) {
		// proxy cookies for baas requests
		const cookie = event.request.headers.get('cookie');
		if (cookie) {
			request.headers.set('cookie', cookie);
		}
	}
	return fetch(request);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
