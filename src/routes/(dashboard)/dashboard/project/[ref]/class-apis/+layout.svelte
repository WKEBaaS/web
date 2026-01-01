<script lang="ts">
	import { page } from '$app/state';
	import { FolderOpenIcon } from '@lucide/svelte';
	import { ClassFuncSidebar } from './(components)/classfunc-sidebar';

	if (!page.params.ref) {
		throw new Error('Project reference is missing in the URL parameters.');
	}

	let { data, children } = $props();
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<header class="flex h-12 shrink-0 items-center justify-between border-b px-4">
		<div class="flex items-center gap-2">
			<FolderOpenIcon class="size-5" />
			<span class="font-bold">Class APIs</span>
		</div>
		<div class="text-xs">Class Visualization</div>
	</header>

	<div class="flex flex-1">
		<!-- Content Area -->
		<ClassFuncSidebar functions={data.functions} project={data.project} />
		{@render children()}
	</div>
</div>
