<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DeleteCreateClassFunc } from '$lib/components/delete-create-class-func';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ProjectDetail } from '$lib/schemas';
	import type { CreateClassFuncMeta } from '$lib/schemas/index.js';
	import { Trash2Icon } from '@lucide/svelte';

	interface ClassFuncSidebarProps {
		ref?: HTMLElement | null;
		functions: CreateClassFuncMeta[];
		project: ProjectDetail;
	}

	let { ref = $bindable(null), functions, project }: ClassFuncSidebarProps = $props();
	let toDeleteFuncName = $state('');
	let deleteFuncDialogOpen = $state(false);

	const handleDeleteFunc = (name: string) => {
		toDeleteFuncName = name;
		deleteFuncDialogOpen = true;
	};
</script>

<Sidebar.Root bind:ref collapsible="none" class="bg-muted border-s lg:flex">
	<Sidebar.Content>
		<Sidebar.Group>
			<Button
				href={resolve(`/(dashboard)/dashboard/project/[ref]/class-apis/new`, {
					ref: page.params.ref!
				})}
				variant="outline">New Function (API)</Button
			>
		</Sidebar.Group>
		<Sidebar.Separator />
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each functions as func (func.id)}
					<ContextMenu.Root>
						<ContextMenu.Trigger>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={resolve(`/(dashboard)/dashboard/project/[ref]/class-apis/[name]/[version]`, {
												ref: page.params.ref!,
												name: func.name,
												version: func.version.toString()
											})}
											{...props}
										>
											<span>{func.name}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item onclick={() => handleDeleteFunc(func.name)}>
								<Trash2Icon class="text-destructive" />
								<span>Delete</span>
							</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>

<DeleteCreateClassFunc
	{project}
	bind:open={deleteFuncDialogOpen}
	bind:name={toDeleteFuncName}
	onDelete={() => {
		invalidateAll();
	}}
/>
