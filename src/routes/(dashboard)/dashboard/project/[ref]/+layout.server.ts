import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { projectDetailSchema, projectSettings } from '$lib/schemas';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.session) {
		error(401, { message: 'Unauthorized' });
	}

	const projectURL = new URL('/v1/project/by-ref', privateEnv.BAAS_API_URL);
	projectURL.searchParams.append('ref', event.params.ref);
	const projectRes = await event.fetch(projectURL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!projectRes.ok) {
		console.error('Failed to fetch project:', projectRes);
		error(404, 'Failed to fetch project.');
	}

	const projectData = await projectRes.json();
	const project = await v.safeParseAsync(projectDetailSchema, projectData).catch((err) => {
		console.error('Project validation failed:', err);
		return error(500, 'Project validation failed.');
	});
	if (!project.success) {
		console.error('Project validation failed:', project.issues);
		error(500, 'Project validation failed.');
	}

	const projectSettingsURL = new URL('/v1/project/settings/by-ref', privateEnv.BAAS_API_URL);
	projectSettingsURL.searchParams.append('ref', event.params.ref);
	const projectSettingsRes = await event.fetch(projectSettingsURL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!projectSettingsRes.ok) {
		console.error('Failed to fetch project settings:', projectSettingsRes);
		error(404, 'Failed to fetch project settings.');
	}

	const projectSettingsData = await projectSettingsRes.json();
	const settings = await v.safeParseAsync(projectSettings, projectSettingsData);
	if (!settings.success) {
		console.error('Project settings validation failed:', JSON.stringify(settings.issues, null, 2));
		error(500, 'Project settings validation failed.');
	}

	const externalURL = new URL(publicEnv.PUBLIC_EXTERNAL_URL);
	const projectExternalURL = `https://${project.output.reference}.${externalURL.host}`;

	return {
		project: project.output,
		settings: settings.output,
		projectURL: projectExternalURL
	};
};
