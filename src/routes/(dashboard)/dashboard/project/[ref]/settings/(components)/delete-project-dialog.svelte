<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages';
	import { deleteProject } from '$lib/remotes/project.remote';
	import type { ProjectDetail } from '$lib/schemas';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		project: ProjectDetail;
	}

	let { project }: Props = $props();

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>{m.delete_this_project()}</AlertDialog.Trigger
	>
	<AlertDialog.Content>
		<form {...deleteProject} oninput={() => deleteProject.validate()}>
			<input {...deleteProject.fields.id.as('hidden', project.id)} />
			<input {...deleteProject.fields.expected.as('hidden', project.name)} />
			<AlertDialog.Header class="mb-4">
				<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
				<AlertDialog.Description>
					{m.delete_project_description()}
				</AlertDialog.Description>
				<Field.Field>
					<Field.Label for="delete-project-confirmation">{m.please_type_to_confirm({ name: project.name })}</Field.Label
					>
					<Input id="delete-project-confirmation" {...deleteProject.fields.name.as('text')} />
					{#each deleteProject.fields.name.issues() ?? [] as issue (issue.message)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Field>
			</AlertDialog.Header>
			<AlertDialog.Footer class="inline-flex w-full items-center justify-end space-x-2">
				<AlertDialog.Cancel type="button">{m.cancel()}</AlertDialog.Cancel>
				{#if deleteProject.pending}<LoaderCircle class="animate-spin" />{/if}
				<AlertDialog.Action type="submit">{m.confirm()}</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
