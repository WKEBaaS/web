import type { AuthProvider } from '$lib/schemas';

const INITIAL_CLASS_INPUT: AuthProvider = {
	enabled: false,
	clientId: undefined,
	clientSecret: undefined
};

export class AuthProviderStore {
	in = $state(INITIAL_CLASS_INPUT);

	constructor(init: AuthProvider | null = null) {
		if (!init) return;
		this.in = { ...this.in, ...init };
	}

	set(input: AuthProvider) {
		this.in = { ...input };
	}

	reset() {
		this.in = { ...INITIAL_CLASS_INPUT };
	}

	value(): AuthProvider {
		return this.in;
	}
}
