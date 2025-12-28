import { env } from '$env/dynamic/private';
import { createPostgrestClient } from '@wke-baas/postgrest-client';

export const pgrestClient = createPostgrestClient(env.PGREST_API_URL);

export const rpc = {
	getProjectS3Settings: 'rpc/get_project_s3_settings',
	getCreateClassFunction: 'rpc/get_create_class_function',
	getCreateClassFunctionVersions: 'rpc/get_create_class_function_versions',
	getCreateClassFunctions: 'rpc/get_create_class_functions'
};
