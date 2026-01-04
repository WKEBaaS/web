import * as v from 'valibot';

export const classSchema = v.object({
	// Primary Key with nanoid default
	id: v.pipe(v.string(), v.maxLength(21), v.nonEmpty()),

	// Foreign Key: dbo.entities
	entity_id: v.nullable(v.number()),

	// Descriptive Fields (nullable strings)
	chinese_name: v.nullable(v.pipe(v.string(), v.maxLength(256))),
	chinese_description: v.nullable(v.pipe(v.string(), v.maxLength(4000))),
	english_name: v.nullable(v.pipe(v.string(), v.maxLength(256))),
	english_description: v.nullable(v.pipe(v.string(), v.maxLength(4000))),

	// Unique Constraints
	id_path: v.pipe(v.string(), v.maxLength(2300), v.nonEmpty()),
	name_path: v.pipe(v.string(), v.maxLength(2300), v.nonEmpty()),

	// Timestamps & Soft Delete
	created_at: v.pipe(v.string(), v.isoTimestamp()),
	updated_at: v.pipe(v.string(), v.isoTimestamp()),
	deleted_at: v.nullable(v.pipe(v.string(), v.isoTimestamp())),

	// Integer Metrics & Ranks
	object_count: v.pipe(v.number(), v.integer(), v.minValue(0)),
	class_rank: v.pipe(v.number(), v.integer()),
	object_rank: v.pipe(v.number(), v.integer()),
	hierarchy_level: v.pipe(v.number(), v.integer()),
	click_count: v.pipe(v.number(), v.integer(), v.minValue(0)),

	// Postgres Array
	keywords: v.nullable(v.array(v.string())),

	// Owner (Foreign Key to auth.users - UUID)
	owner_id: v.nullable(v.pipe(v.string(), v.uuid())),

	// Booleans
	is_hidden: v.boolean(),
	is_child: v.boolean()
});

export const classMetadataSchema = v.pick(classSchema, ['id', 'chinese_name']);

export const permissionSchema = v.object({
	class_id: v.pipe(v.string(), v.length(21, 'Class ID must be exactly 21 characters')),
	role_type: v.picklist(['USER', 'GROUP']),
	role_id: v.pipe(v.string(), v.uuid('Role ID must be a valid UUID')),
	permission_bits: v.pipe(
		v.number(),
		v.integer('Permission bits must be an integer'),
		v.minValue(0, 'Permission bits is too small for int16'),
		v.maxValue(32767, 'Permission bits is too large for int16')
	),
	// additional
	role_name: v.optional(v.string())
});

export const roleSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.string(),
	email: v.optional(v.string())
});

// Type inference
export type Class = v.InferInput<typeof classSchema>;
export type ClassMetadata = v.InferInput<typeof classMetadataSchema>;
export type Permission = v.InferInput<typeof permissionSchema>;
export type Role = v.InferInput<typeof roleSchema>;
