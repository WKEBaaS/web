import * as api from '$lib/server';
import type { PageServerLoad } from './$types';
import { s3SettingSchema } from './schema';

export const load: PageServerLoad = async (event) => {
	const { project } = await event.parent();

	const token = await api.auth.fetchToken(event);
	const s3Settings = await api.pgrest.get({
		endpoint: api.rpc.getProjectS3Settings,
		token: token,
		schema: s3SettingSchema,
		params: {
			p_project_id: project.id
		}
	});

	const access_key_id = s3Settings.access_key_id;
	const secret_access_key = s3Settings.secret_access_key;
	const bucketName = `baas-${event.params.ref}`;

	return {
		bucketName: bucketName,
		accessKeyID: access_key_id,
		secretAccessKey: secret_access_key
	};
};
