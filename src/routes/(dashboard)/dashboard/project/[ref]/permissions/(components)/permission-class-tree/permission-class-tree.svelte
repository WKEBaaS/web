<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import CreateNewClass from '$lib/components/create-new-class/create-new-class.svelte';
	import { DeleteClass } from '$lib/components/delete-class';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { ClassMetadata } from '$lib/schemas/index.js';
	import { cn } from '$lib/utils';
	import { ChevronRight, FolderClosedIcon, FolderOpenIcon, FolderPlusIcon, Trash2Icon } from '@lucide/svelte';
	import { PermissionClassTree } from '.';

	interface Props {
		nodeClass: ClassMetadata;
		ref: string;
		level?: number;
		// Callback when this class is removed
		onRemove?: () => void;
	}

	let { nodeClass, ref, level = 0, onRemove }: Props = $props();

	let open = $derived(level === 0);
	let isActive = $derived(page.params.class_id === nodeClass.id);
	let children: ClassMetadata[] = $state([]);
	let fetched = $state(false);
	let createClassOpen = $state(false);
	let deleteClassOpen = $state(false);

	$effect(() => {
		if (!fetched && open && children.length === 0) {
			let uri = resolve(`/api/project/[ref]/class-children`, {
				ref: ref
			});
			fetch(uri + `?pcid=${nodeClass.id}`)
				.then((resp) => (resp.ok ? resp : Promise.reject(new Error('Failed to fetch class children'))))
				.then((resp) => resp.json())
				.then((data) => {
					fetched = true;
					children = data;
				});
		}
	});

	function toggle(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		open = !open;
	}
</script>

<CreateNewClass
	bind:open={createClassOpen}
	parentClassId={nodeClass.id}
	projectRef={ref}
	onCreated={() => {
		// Refresh children
		fetched = false;
		children = [];
	}}
/>
<DeleteClass bind:open={deleteClassOpen} projectRef={ref} classId={nodeClass.id} onDelete={onRemove} />

<div class="space-y-1">
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<a
				data-sveltekit-preload-data="tap"
				href={resolve(`/(dashboard)/dashboard/project/[ref]/permissions/[class_id]`, {
					ref: ref,
					class_id: nodeClass.id
				})}
				class={cn(
					'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
					'hover:bg-accent hover:text-accent-foreground',
					isActive && 'bg-accent text-accent-foreground font-medium'
				)}
			>
				<button onclick={toggle} class="flex h-4 w-4 items-center justify-center">
					<ChevronRight class={cn('text-muted-foreground/70 h-3 w-3 transition-transform', open && 'rotate-90')} />
				</button>

				{#if open}
					<FolderOpenIcon class="text-muted-foreground/70 h-4 w-4 shrink-0" />
				{:else}
					<FolderClosedIcon class="text-muted-foreground/70 h-4 w-4 shrink-0" />
				{/if}

				<span class="flex-1 truncate">
					{nodeClass.chinese_name ?? nodeClass.id}
				</span>
			</a>
		</ContextMenu.Trigger>
		<ContextMenu.Content class="space-y-2">
			<ContextMenu.Item onclick={() => (createClassOpen = true)}>
				<FolderPlusIcon />
				<span>New Class</span>
			</ContextMenu.Item>
			<Separator />
			<ContextMenu.Item onclick={() => (deleteClassOpen = true)}>
				<Trash2Icon class="text-destructive" />
				<span>Delete</span>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>

	{#if open}
		<div class="border-border ml-3 space-y-1 border-l pl-3">
			{#if !fetched && children.length === 0}
				<div class="text-muted-foreground px-2 py-1.5 text-sm">載入中...</div>
			{:else}
				{#each children as child (child.id)}
					<PermissionClassTree
						nodeClass={child}
						{ref}
						level={level + 1}
						onRemove={() => {
							// Remove child from children array when deleted
							children = children.filter((c) => c.id !== child.id);
						}}
					/>
				{/each}
			{/if}
		</div>
	{/if}
</div>
