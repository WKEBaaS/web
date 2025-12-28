<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { updateAuthProvider } from '$lib/remotes'; // 參考你的遠端請求函式
	import type { AuthProvider } from '$lib/schemas';
	import { AuthProviderStore } from '$lib/stores/auth-provider.svelte';
	import type { Icon } from '@lucide/svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ClipboardIcon from '@lucide/svelte/icons/clipboard';
	import type { ComponentProps } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { UpdateAuthProviderType } from '../schema';

	type OAuthSettingsProps = ComponentProps<typeof Drawer.Root> & {
		type: Exclude<UpdateAuthProviderType, 'email'>;
		name: string;
		icon: typeof Icon;
		projectId: string;
		projectURL: string;
		// default values for the auth provider settings
		auth?: AuthProvider;
	};

	let {
		type,
		name,
		icon: ProviderIcon,
		open = $bindable(false),
		projectId,
		projectURL,
		auth,
		...restProps
	}: OAuthSettingsProps = $props();

	let loading = $state(false);
	let authProvider = $derived(new AuthProviderStore(auth));

	const clipboard = new UseClipboard();
	const redirectURL = $derived(new URL(`/api/auth/callback/${type}`, projectURL).toString());

	const handleUpdateAuthProvider = async () => {
		const res = await updateAuthProvider({
			id: projectId,
			type: type,
			[type]: {
				enabled: authProvider.in.enabled,
				clientId: authProvider.in.clientId,
				clientSecret: authProvider.in.clientSecret
			}
		});

		if (res.success) {
			toast.success(m.auth_provider_settings_updated());
			open = false; // 成功後關閉
		} else {
			toast.error(`${m.auth_provider_settings_update_failed()}: ${res.message}`);
		}
	};
</script>

<Drawer.Root bind:open {...restProps}>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="flex items-center gap-2">
				<ProviderIcon class="size-6" />
				{m.auth_provider_settings()}
			</Drawer.Title>
			<Drawer.Description>{m.auth_provider_settings_description()}</Drawer.Description>

			<div class="mt-8 space-y-4">
				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						class="w-fit gap-1 px-2 shadow-none"
						size="sm"
						onclick={() => clipboard.copy(redirectURL)}
					>
						{#if clipboard.copied}
							<CheckIcon class="text-primary size-4" />
						{:else}
							<ClipboardIcon class="text-muted-foreground size-4" />
						{/if}
						<span class="text-foreground max-w-62.5 truncate">{redirectURL}</span>
					</Button>
					<Badge class="h-5 shrink-0">
						{name} Redirect URL
					</Badge>
				</div>

				<div class="space-y-4 rounded-lg border p-4">
					<Field.Field orientation="horizontal" class="flex items-center justify-between">
						<div class="space-y-0.5">
							<Field.Label>{m.enable_auth({ name })}</Field.Label>
							<div class="text-muted-foreground text-[0.8rem]">
								{m.enable_auth_description({ name })}
							</div>
						</div>
						<Switch bind:checked={authProvider.in.enabled} />
					</Field.Field>

					<Field.Field class="flex flex-col gap-2">
						<Field.Label>{m.auth_client_id({ name })}</Field.Label>
						<Input bind:value={authProvider.in.clientId} placeholder="Enter client ID" />
					</Field.Field>

					<Field.Field class="flex flex-col gap-2">
						<Field.Label>{m.auth_client_secret({ name })}</Field.Label>
						<Input type="password" bind:value={authProvider.in.clientSecret} placeholder="Enter client secret" />
					</Field.Field>
				</div>
			</div>
		</Drawer.Header>

		<Drawer.Footer>
			<Button onclick={handleUpdateAuthProvider} disabled={loading}>
				{loading ? 'Saving...' : m.save()}
			</Button>
			<Drawer.Close type="button">{m.cancel()}</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
