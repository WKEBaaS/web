import { getRequestEvent, query } from '$app/server';
import { env } from '$env/dynamic/private';
import { type Role, roleSchema } from '$lib/schemas';
import * as v from 'valibot';

export const getRoles = query(
	v.object({
		ref: v.string(),
		role_type: v.picklist(['USER', 'GROUP']),
		query: v.string()
	}),
	async (data) => {
		if (data.query === '') {
			return { success: true, roles: [] as Array<Role> };
		}
		const url = new URL('/v1/project/db-roles', env.BAAS_API_URL);
		url.searchParams.append('ref', data.ref);
		url.searchParams.append('role_type', data.role_type);
		url.searchParams.append('query', data.query);

		const event = getRequestEvent();
		const res = await event.fetch(url);

		if (!res.ok) {
			console.error('Failed to fetch roles:', res.status, res.statusText);
			return { success: false, message: 'Failed to fetch roles.', roles: [] as Array<Role> };
		}

		const respData = await res.json();
		const parsed = await v.safeParseAsync(v.array(roleSchema), respData.roles || []);
		if (!parsed.success) {
			console.error('Failed to parse roles:', parsed.issues);
			return { success: false, message: 'Failed to parse roles.', roles: [] as Array<Role> };
		}

		return {
			success: true,
			roles: parsed.output
		};
	}
);
