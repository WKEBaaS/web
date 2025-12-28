import { command, form, getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { type AuthProvider, updateAuthProviderSchema, updateProxyURLSchema } from '$lib/schemas';
import { error } from '@sveltejs/kit';

export const updateAuthProvider = command(updateAuthProviderSchema, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.session) {
		error(401, { message: 'Unauthorized' });
	}

	const authPayload: Record<string, AuthProvider> = {};
	if (data.email) {
		authPayload.email = data.email;
	}
	const provider = data[data.type];
	if (provider) {
		authPayload[data.type] = provider;
	}

	const patchSettingsURL = new URL('/v1/project/settings', env.BAAS_API_URL);
	const patchSettingsRes = await event.fetch(patchSettingsURL, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: data.id,
			auth: authPayload
		})
	});

	if (!patchSettingsRes.ok) {
		console.error('Failed to update authentication provider settings:', patchSettingsRes);
		const message = await patchSettingsRes.text();
		return { success: false, message };
	}

	return { success: true };
});

export const updateProxyURL = form(updateProxyURLSchema, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.session) {
		error(401, { message: 'Unauthorized' });
	}

	const patchSettingsURL = new URL('/v1/project/settings', env.BAAS_API_URL);
	const patchSettingsRes = await event.fetch(patchSettingsURL, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!patchSettingsRes.ok) {
		console.error('Failed to update proxy URL settings:', patchSettingsRes);
		const message = await patchSettingsRes.text();
		return { success: false, message };
	}

	return { success: true };
});
