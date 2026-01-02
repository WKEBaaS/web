<script lang="ts">
	import { ExternalLinkIcon, FileTextIcon } from '@lucide/svelte';
	import { Button } from '../ui/button';

	interface ExternalLinkProps {
		url: string;
		title?: string;
		description?: string;
	}

	let { url, title, description }: ExternalLinkProps = $props();
</script>

<!-- API Docs Link -->
<div class="bg-accent border-border flex items-center justify-between rounded-lg border p-4">
	<div class="flex items-center gap-3">
		<FileTextIcon class="text-primary h-5 w-5" />
		<div>
			<h4 class="text-accent-foreground font-medium">{title}</h4>
			<p class="text-muted-foreground text-sm">{description}</p>
		</div>
	</div>
	<Button target="_blank" href={url} variant="outline" size="sm" class="border-border text-foreground hover:bg-muted">
		<ExternalLinkIcon class="mr-2 h-4 w-4" />
		Open Docs
	</Button>
</div>
