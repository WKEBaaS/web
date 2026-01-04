import { getRoles } from '$lib/remotes/project-db.remote.js';

export const GET = async (event) => {
	const ref = event.params.ref;
	const role_type = event.url.searchParams.get('role_type');
	const query = event.url.searchParams.get('query') || '';

	if (!role_type || (role_type !== 'USER' && role_type !== 'GROUP')) {
		return new Response('invalid or missing role_type in query', { status: 400 });
	}

	if (query === '') {
		return new Response(JSON.stringify([]));
	}

	const res = await getRoles({
		ref,
		role_type,
		query
	});

	if (!res.success) {
		return new Response(res.message, { status: 500 });
	}

	return new Response(JSON.stringify(res.roles));
};
