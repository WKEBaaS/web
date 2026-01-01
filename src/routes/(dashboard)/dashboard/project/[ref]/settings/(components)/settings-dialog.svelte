<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js'; // 改用 Field
	import { Input } from '$lib/components/ui/input/index.js';
	import * as m from '$lib/paraglide/messages';
	import { updateProjectInfo } from '$lib/remotes'; // Remote function
	import type { ProjectDetail } from '$lib/schemas';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';

	interface SettingDialogProps {
		open?: boolean;
		project: ProjectDetail;
	}

	let { open = $bindable(false), project }: SettingDialogProps = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}>{m.update_project_setting()}</AlertDialog.Trigger>
	<AlertDialog.Content>
		<form
			{...updateProjectInfo.enhance(async ({ form, submit }) => {
				await submit();

				if (updateProjectInfo.result?.success) {
					form.reset();
					toast.success(m.project_info_updated());
					open = false;
				} else {
					toast.error(m.project_info_update_failed(), {
						description: updateProjectInfo.result?.message
					});
				}
			})}
			oninput={() => updateProjectInfo.validate()}
		>
			<input {...updateProjectInfo.fields.id.as('hidden', project.id)} />
			<AlertDialog.Header>
				<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
				<AlertDialog.Description>
					{m.update_project_setting_description()}
				</AlertDialog.Description>

				<div class="my-3 space-y-4">
					<Field.Field>
						<Field.Label>{m.project_name()}</Field.Label>
						<Input {...updateProjectInfo.fields.name.as('text')} placeholder="" />
						{#each updateProjectInfo.fields.name.issues() ?? [] as issue (issue.message)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>

					<Field.Field>
						<Field.Label>{m.project_description()}</Field.Label>
						<Input {...updateProjectInfo.fields.description.as('text')} placeholder="" />
						{#each updateProjectInfo.fields.description.issues() ?? [] as issue (issue.message)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
				</div>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">{m.cancel()}</AlertDialog.Cancel>

				{#if updateProjectInfo.pending}
					<LoaderCircleIcon class="animate-spin" />
				{/if}

				<AlertDialog.Action type="submit">{m.confirm()}</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
