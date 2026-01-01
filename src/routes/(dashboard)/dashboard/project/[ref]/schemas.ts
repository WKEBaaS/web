import * as v from 'valibot';

export const projectStatusSchema = v.object({
	message: v.string(),
	step: v.number(),
	totalStep: v.number()
});

export type ProjectStatus = v.InferOutput<typeof projectStatusSchema>;
