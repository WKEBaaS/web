import * as v from 'valibot';

export const authProviderSchema = v.pipe(
	v.object({
		enabled: v.boolean(),
		clientId: v.optional(v.pipe(v.string(), v.maxLength(100))),
		clientSecret: v.optional(v.pipe(v.string(), v.maxLength(100)))
	}),
	v.forward(
		v.partialCheck(
			[['enabled'], ['clientId']],
			(s) => !s.enabled || !!s.clientId,
			'must be provided if the authentication provider is enabled.'
		),
		['clientId']
	),
	v.forward(
		v.partialCheck(
			[['enabled'], ['clientSecret']],
			(s) => !s.enabled || !!s.clientSecret,
			'must be provided if the authentication provider is enabled.'
		),
		['clientSecret']
	)
);

export const updateAuthProviderType = ['email', 'google', 'github', 'discord'] as const;
export const updateAuthProviderSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	type: v.picklist(updateAuthProviderType),
	email: v.optional(
		v.object({
			enabled: v.boolean()
		})
	),
	google: v.optional(authProviderSchema),
	github: v.optional(authProviderSchema),
	discord: v.optional(authProviderSchema)
});

export const updateProxyURLSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	proxyURL: v.optional(v.pipe(v.string(), v.url(), v.maxLength(200)))
});

export type UpdateAuthProviderType = (typeof updateAuthProviderType)[number];
export type UpdateAuthProvider = v.InferInput<typeof updateAuthProviderSchema>;
export type AuthProvider = v.InferInput<typeof authProviderSchema>;
export type UpdateProxyURL = v.InferInput<typeof updateProxyURLSchema>;
