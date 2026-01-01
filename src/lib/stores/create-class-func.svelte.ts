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
	in = $state(INITIAL_NODE);

	constructor(init: Partial<CreateClassFuncInput> | null = null) {
		if (!init) return;

		this.in = { ...this.in, ...init };
	}

	set(input: Partial<CreateClassFuncInput>) {
		this.in = { ...this.in, ...input };
	}

	value() {
		return this.in;
	}

	get name() {
		return this.in.name;
	}
	set name(val: string) {
		this.in.name = val;
	}

	get version() {
		return this.in.version;
	}
	set version(val: number) {
		this.in.version = val;
	}

	get description() {
		return this.in.description;
	}
	set description(val: string) {
		this.in.description = val;
	}

	get authenticated() {
		return this.in.authenticated;
	}
	set authenticated(val: boolean) {
		this.in.authenticated = val;
	}

	get root_class_id() {
		return this.in.root_node.class_id;
	}
	set root_class_id(val: CreateClassFuncInput['root_node']['class_id']) {
		this.in.root_node.class_id = val;
	}

	get root_check_permission() {
		return this.in.root_node.check_permission;
	}
	set root_check_permission(val: CreateClassFuncInput['root_node']['check_permission']) {
		this.in.root_node.check_permission = val;
	}

	get root_check_bits() {
		return this.in.root_node.check_bits;
	}
	set root_check_bits(val: CreateClassFuncInput['root_node']['check_bits']) {
		this.in.root_node.check_bits = val;
	}

	get node() {
		return this.in.node;
	}
}
