<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import * as m from '$lib/paraglide/messages.js';
	import { updateAuthProvider } from '$lib/remotes';
	import MailIcon from '@lucide/svelte/icons/mail';
	import type { ComponentProps } from 'svelte';
	import { toast } from 'svelte-sonner';

	type EmailSettingsProps = ComponentProps<typeof Drawer.Root> & {
		projectId: string;
	};

	let { open = $bindable(false), projectId, ...restProps }: EmailSettingsProps = $props();
	let enabled = $state(false);

	const handleUpdateAuthProvider = async () => {
		const res = await updateAuthProvider({
			id: projectId,
			type: 'email',
			email: {
				enabled: enabled
			}
		});
		if (res.success) {
			toast.success(m.auth_provider_settings_updated());
		} else {
			toast.error(m.auth_provider_settings_update_failed() + `: ${res.message}`);
		}
	};
</script>

<Drawer.Root bind:open {...restProps}>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="flex items-center gap-2">
				<MailIcon class="text-muted-foreground size-6" />
				Email
			</Drawer.Title>
			<Drawer.Description>{m.update_email_settings_description()}</Drawer.Description>
			<div class="mt-8 space-y-4">
				<Field.Field orientation="horizontal" class="flex items-center">
					<Field.Label>{m.enable_email_provider()}</Field.Label>
					<Switch bind:checked={enabled} />
				</Field.Field>
			</div>
		</Drawer.Header>
		<Drawer.Footer>
			<Button onclick={handleUpdateAuthProvider}>{m.save()}</Button>
			<Drawer.Close type="button">{m.cancel()}</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
