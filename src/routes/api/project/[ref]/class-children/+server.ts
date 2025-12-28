import { env } from '$env/dynamic/private';
import { classMetadataSchema } from '$lib/schemas';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const GET = async (event) => {
	const pcid = event.url.searchParams.get('pcid');

	if (!pcid) {
		return new Response('missing pcid in query', { status: 400 });
	}

	const url = new URL('/v1/project/class-children', env.BAAS_API_URL);
	url.searchParams.append('ref', event.params.ref);
	url.searchParams.append('pcid', pcid);

	const resp = await event.fetch(url);
	if (!resp.ok) {
		console.error('Failed to fetch first level classes:', resp.status, resp.statusText);
		error(resp.status, 'Failed to fetch first level classes');
	}

	const data = await resp.json();
	const parsed = await v.safeParseAsync(v.array(classMetadataSchema), data.classes);
	if (!parsed.success) {
		console.error('Failed to parse first level classes:', parsed.issues);
		error(500, 'Failed to parse first level classes');
	}

	return new Response(JSON.stringify(parsed.output));
};
