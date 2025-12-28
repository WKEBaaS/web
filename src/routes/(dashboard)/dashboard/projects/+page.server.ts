import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';
import { projectListSchema } from './schemas';

export const load: PageServerLoad = async (event) => {
	const apiUrl = new URL('/v1/project/users', env.BAAS_API_URL);
	console.debug('Cookies:', event.request.headers.get('cookie'));
	const res = await event.fetch(apiUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: event.request.headers.get('cookie') || ''
		}
	});

	if (!res.ok) {
		console.error('Failed to fetch projects:', res);
		error(404, 'Failed to fetch projects.');
	}

	const data = await res.json();
	const projects = await v.safeParseAsync(projectListSchema, data.projects || []);
	if (!projects.success) {
		console.error('Project list validation failed:', projects.issues);
		error(500, 'Project list validation failed.');
	}
	return {
		projects: projects.output
	};
};
