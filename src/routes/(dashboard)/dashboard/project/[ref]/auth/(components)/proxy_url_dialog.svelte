<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as m from '$lib/paraglide/messages';
	import { updateProxyURL } from '$lib/remotes';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';

	interface ProxyURLDialogProps {
		open?: boolean;
		projectId: string;
		proxyURL?: string;
	}

	let { open = $bindable(false), projectId, proxyURL }: ProxyURLDialogProps = $props();

	$effect(() => {
		updateProxyURL.fields.proxyURL.set(proxyURL ?? '');
	});
</script>

<div class="bg-card flex items-end justify-between rounded-lg border p-4">
	<div class="mr-4 flex-1 space-y-3">
		<div class="space-y-1">
			<h3 class="text-base font-medium">{m.update_proxy_url()}</h3>
			<p class="text-muted-foreground text-sm">{m.update_proxy_url_description()}</p>
		</div>
	</div>

	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}>{m.update_proxy_url()}</AlertDialog.Trigger>
		<AlertDialog.Content>
			<form
				{...updateProxyURL.enhance(async ({ submit }) => {
					await submit();
					if (updateProxyURL.result?.success) {
						toast.success(m.proxy_url_updated());
						open = false;
					} else {
						toast.error(m.update_proxy_url() + ` failed: ${updateProxyURL.result?.message}`);
					}
				})}
			>
				<input {...updateProxyURL.fields.id.as('hidden', projectId)} />
				<AlertDialog.Header>
					<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
					<AlertDialog.Description>
						{m.update_proxy_url_description()}
					</AlertDialog.Description>

					<!-- update project setting form fields -->
					<div class="my-3 space-y-4">
						<Field.Field>
							<Field.Label for="proxy-url">{m.proxy_url()}</Field.Label>
							<Input id="proxy-url" {...updateProxyURL.fields.proxyURL.as('text')} />
							{#each updateProxyURL.fields.proxyURL.issues() ?? [] as issue (issue)}
								<Field.FieldError>{issue.message}</Field.FieldError>
							{/each}
						</Field.Field>
					</div>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel type="button">{m.cancel()}</AlertDialog.Cancel>
					{#if updateProxyURL.pending}<LoaderCircleIcon class="animate-spin" />{/if}
					<AlertDialog.Action type="submit">{m.confirm()}</AlertDialog.Action>
				</AlertDialog.Footer>
			</form>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
