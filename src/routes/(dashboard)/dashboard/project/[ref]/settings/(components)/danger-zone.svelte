<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as m from '$lib/paraglide/messages';
	import type { ProjectDetail } from '$lib/schemas';
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
	import DeleteProjectDialog from './delete-project-dialog.svelte';

	let { project }: { project: ProjectDetail } = $props();
</script>

<Card.Root class="border-destructive/20">
	<Card.Header>
		<Card.Title class="text-destructive flex items-center gap-2">
			<AlertTriangleIcon class="h-5 w-5" />
			{m.danger_zone()}
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-6">
		<div class="border-destructive/20 bg-muted flex items-center justify-between rounded-lg border p-4">
			<div class="space-y-1">
				<h3 class="text-base font-medium">Change package visibility</h3>
				<p class="text-muted-foreground text-sm">This package is currently public.</p>
			</div>
			<Button disabled variant="destructive">Change visibility</Button>
		</div>
		<div class="border-destructive/20 bg-muted flex items-center justify-between rounded-lg border p-4">
			<div class="space-y-1">
				<h3 class="text-base font-medium">{m.delete_this_project()}</h3>
				<p class="text-muted-foreground text-sm">
					{m.delete_project_description()}
				</p>
			</div>
			<DeleteProjectDialog {project} />
		</div>
	</Card.Content>
</Card.Root>
