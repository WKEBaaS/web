<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { deleteCreateClassFunc } from '$lib/remotes';
	import type { ProjectDetail } from '$lib/schemas';
	import { toast } from 'svelte-sonner';

	interface DeleteClassProps {
		open?: boolean;
		project: ProjectDetail;
		name: string;
		onDelete?: () => void;
	}

	const handleDelete = async () => {
		const res = await deleteCreateClassFunc({
			project_id: project.id,
			project_ref: project.reference,
			name: name
		});
		if (res.success) {
			toast.success('API deleted successfully!');
			onDelete?.();
			open = false;
		} else {
			toast.error(`Failed to delete API`);
		}
	};

	let { open = $bindable(false), name = $bindable(''), project, onDelete }: DeleteClassProps = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete the Create Function</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this function? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
