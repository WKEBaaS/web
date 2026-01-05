import type { CreateClassFuncInput } from '$lib/schemas';

const INITIAL_NODE: CreateClassFuncInput = {
	project_id: '',
	project_ref: '',
	name: '',
	version: 1,
	description: '',
	authenticated: false,
	root_node: {
		class_id: '',
		check_permission: false,
		check_bits: 0
	},
	node: {
		fields: {
			chinese_name: null,
			chinese_description: null,
			english_name: null,
			english_description: null,
			entity_id: null
		},
		permissions: [],
		children: []
	}
};

export class CreateClassFuncStore {
	data = $state(INITIAL_NODE);

	constructor(init: Partial<CreateClassFuncInput> | null = null) {
		if (!init) return;

		this.data = { ...this.data, ...init };
	}

	set(input: Partial<CreateClassFuncInput>) {
		this.data = { ...this.data, ...input };
	}

	value() {
		return this.data;
	}
}
