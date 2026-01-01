import { command, getRequestEvent, query } from '$app/server';
import { env } from '$env/dynamic/private';
import { createClassFuncMetaSchema, createClassFuncSchema, deleteCreateClassFuncSchema } from '$lib/schemas';
import * as api from '$lib/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const createClassFunc = command(createClassFuncSchema, async (data) => {
	const event = getRequestEvent();
	const url = new URL('/v1/project/create-classes-function', env.BAAS_API_URL);
	const resp = await event.fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!resp.ok) {
		console.error('Failed to create class function:', resp.status, resp.statusText);
		error(resp.status, 'Failed to create class function');
	}

	return {
		success: true
	};
});

export const deleteCreateClassFunc = command(deleteCreateClassFuncSchema, async (data) => {
	const event = getRequestEvent();
	const url = new URL('/v1/project/create-classes-function', env.BAAS_API_URL);
	const resp = await event.fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!resp.ok) {
		console.error('Failed to delete class function:', resp.status, resp.statusText);
		error(resp.status, 'Failed to delete class function');
	}

	return {
		success: true
	};
});

export const getCreateClassFuncs = query(v.string(), async (project_id: string) => {
	const event = getRequestEvent();
	const token = await api.auth.fetchToken(event);
	const functions = await api.pgrest.get({
		endpoint: api.rpc.getCreateClassFunctions,
		token,
		schema: v.array(createClassFuncMetaSchema),
		params: {
			p_project_id: project_id
		}
	});

	return functions;
});

export const getCreateClassFunc = query(
	v.object({
		project_id: v.string(),
		name: v.string(),
		version: v.number()
	}),
	async (params) => {
		const event = getRequestEvent();
		const token = await api.auth.fetchToken(event);

		const func = await api.pgrest.get({
			endpoint: api.rpc.getCreateClassFunction,
			token,
			schema: v.omit(createClassFuncSchema, ['project_ref']),
			params: {
				p_project_id: params.project_id,
				p_name: params.name,
				p_version: params.version
			}
		});
		return func;
	}
);

export const getCreateClassFuncVersions = query(
	v.object({
		project_id: v.string(),
		name: v.string()
	}),
	async (params) => {
		const event = getRequestEvent();
		const token = await api.auth.fetchToken(event);

		const versions = await api.pgrest.get({
			endpoint: api.rpc.getCreateClassFunctionVersions,
			token,
			schema: v.array(v.number()),
			params: {
				p_project_id: params.project_id,
				p_name: params.name
			}
		});
		return versions;
	}
);
