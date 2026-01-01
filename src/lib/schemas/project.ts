import * as v from 'valibot';
import { authProviderSchema } from './auth';

export const projectDetailSchema = v.object({
	id: v.string(),
	name: v.string(),
	description: v.nullable(v.string()),
	reference: v.string(),
	createdAt: v.string(),
	updatedAt: v.string(),
	passwordExpiredAt: v.nullable(v.string()),
	initializedAt: v.nullable(v.string())
});

export const deleteProjectSchema = v.pipe(
	v.object({
		id: v.string(),
		expected: v.string(),
		name: v.pipe(v.string(), v.minLength(1), v.maxLength(100))
	}),
	v.forward(
		v.partialCheck(
			[['name'], ['expected']],
			(s) => s.name === s.expected,
			(s) => `type "${s.input.expected}" to confirm deletion`
		),
		['name']
	)
);

export const resetDatabasePasswordSchema = v.object({
	password: v.pipe(
		v.string(),
		v.minLength(8),
		v.maxLength(100),
		v.regex(/[A-Z]/, 'must be at least one uppercase letter')
		// v.regex(/[!@#$%^&*(),.?":{}|<>]/, 'must be at least one special character')
	)
});

export const updateProjectInfoSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
	description: v.pipe(v.string(), v.minLength(0), v.maxLength(4000))
});

export const updateAllowedOriginsSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	allowedOrigins: v.pipe(v.array(v.pipe(v.string(), v.url())), v.minLength(1), v.maxLength(100))
});

export const projectSettings = v.object({
	createdAt: v.string(),
	id: v.string(),
	projectId: v.string(),
	trustedOrigins: v.nullable(v.array(v.string())),
	updatedAt: v.string(),
	proxyURL: v.optional(v.pipe(v.string(), v.url(), v.maxLength(200))),
	auth: v.optional(
		v.object({
			email: v.optional(
				v.object({
					enabled: v.boolean()
				})
			),
			google: v.optional(authProviderSchema),
			github: v.optional(authProviderSchema),
			discord: v.optional(authProviderSchema)
		})
	)
});

export type ProjectSettings = v.InferOutput<typeof projectSettings>;
export type ProjectDetail = v.InferOutput<typeof projectDetailSchema>;
export type ResetDatabasePasswordSchema = v.InferInput<typeof resetDatabasePasswordSchema>;
export type UpdateProjectInfoSchema = v.InferInput<typeof updateProjectInfoSchema>;
export type UpdateAllowedOriginsSchema = v.InferInput<typeof updateAllowedOriginsSchema>;
export type DeleteProjectSchema = v.InferInput<typeof deleteProjectSchema>;
