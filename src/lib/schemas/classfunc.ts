import * as v from 'valibot';
import { type Permission, permissionSchema } from './project-db';

const emptyStringToNull = v.pipe(
	v.string(),
	v.transform((str) => (str.trim() === '' ? null : str))
);

// Corresponds to: type FieldConfig struct
const fieldConfigSchema = v.object({
	// *string + omitempty implies the field can be missing or null
	param_name: v.optional(v.nullable(emptyStringToNull)),
	value: v.optional(v.nullable(emptyStringToNull))
});

// Corresponds to: type NodeFields struct
const nodeFieldsSchema = v.object({
	chinese_name: v.nullable(fieldConfigSchema),
	chinese_description: v.optional(v.nullable(fieldConfigSchema)),
	english_name: v.optional(v.nullable(fieldConfigSchema)),
	english_description: v.optional(v.nullable(fieldConfigSchema)),
	entity_id: v.optional(v.nullable(fieldConfigSchema))
});
type NodeFields = v.InferInput<typeof nodeFieldsSchema>;

interface Node {
	fields: NodeFields;
	permissions?: Permission[];
	children?: Node[];
}

// Corresponds to: type Node struct
// We use v.lazy() to handle the recursive 'Children' field
const nodeSchema: v.GenericSchema<Node> = v.object({
	fields: nodeFieldsSchema,
	permissions: v.optional(v.array(permissionSchema)),
	// Recursive definition:
	children: v.optional(v.array(v.lazy(() => nodeSchema)))
});

// --- Root Schemas ---

// Corresponds to: type RootNode struct
const rootNodeSchema = v.object({
	class_id: v.string(),
	check_permission: v.boolean(),
	check_bits: v.pipe(v.number(), v.integer()) // int16
});

// Corresponds to the anonymous 'Body' struct inside CreateClassFunctionInput
export const createClassFuncSchema = v.object({
	project_id: v.string(),
	project_ref: v.string(),
	name: v.string(),
	version: v.pipe(v.number(), v.integer()), // int16
	description: v.string(),
	authenticated: v.boolean(),
	root_node: rootNodeSchema,
	node: nodeSchema
});

export const deleteCreateClassFuncSchema = v.object({
	project_id: v.string(),
	project_ref: v.string(),
	name: v.string()
});

export const createClassFuncMetaSchema = v.object({
	id: v.string(),
	name: v.string(),
	version: v.number(),
	description: v.string()
});

export const createClassFuncSchemaNodeAny = v.object({
	...v.omit(createClassFuncSchema, ['node']).entries,
	node: v.any()
});

export type CreateClassFuncFieldKey = keyof NodeFields;
export type CreateClassFuncNode = v.InferInput<typeof nodeSchema>;
export type CreateClassFuncInput = v.InferInput<typeof createClassFuncSchema>;
export type CreateClassFuncMeta = v.InferInput<typeof createClassFuncMetaSchema>;
export type DeleteCreateClassFuncInput = v.InferInput<typeof deleteCreateClassFuncSchema>;
