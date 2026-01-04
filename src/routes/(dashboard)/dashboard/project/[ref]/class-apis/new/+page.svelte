<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PermissionSelector } from '$lib/components/permission-selector/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { UserClassTree } from '$lib/components/user-class-tree';
	import { createClassFunc } from '$lib/remotes';
	import { CreateClassFuncStore } from '$lib/stores/index.js';
	import { FolderOpenIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { ClassFuncNodeEditor } from '../(components)/classfunc-node-editor/index.js';

	let { data } = $props();
	let createClassFuncInput = $derived(
		new CreateClassFuncStore({
			project_id: data.project.id,
			project_ref: data.project.reference
		})
	);
</script>

<div class="flex w-full flex-col p-3 pb-96 font-mono">
	<Field.Group>
		<div class="mb-4 flex items-center justify-between">
			<Field.Legend>Class Function API</Field.Legend>
			<Button
				variant="default"
				onclick={async () => {
					const res = await createClassFunc(createClassFuncInput.value());
					if (res.success) {
						toast.success('Class Function API created successfully!');
						invalidateAll();
					}
				}}>Create</Button
			>
		</div>
		<Field.Set>
			<Field.Group>
				<div class="grid grid-cols-5 gap-4">
					<Field.Field class="col-span-4">
						<Field.Label for="function-name">Function Name</Field.Label>
						<Input id="function-name" bind:value={createClassFuncInput.name} />
					</Field.Field>
					<Field.Field class="col-span-1">
						<Field.Label for="function-version">Version</Field.Label>
						<Input id="function-version" bind:value={createClassFuncInput.version} type="number" />
					</Field.Field>
				</div>
				<Field.Field>
					<Field.Label for="function-description">Description</Field.Label>
					<Textarea class="h-32" id="function-description" bind:value={createClassFuncInput.description} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Checkbox id="function-need-auth" bind:checked={createClassFuncInput.authenticated} />
					<Field.Label for="function-need-auth">Require Authentication</Field.Label>
				</Field.Field>
			</Field.Group>
			<Field.Separator />
			<Field.Set>
				<Field.Legend>API Root Class</Field.Legend>
				<Field.Description>Root class means all classes created by the API will under this class.</Field.Description>
				<Field.Field>
					<div class="bg-muted/40 text-muted-foreground flex items-center gap-2 rounded border p-3 font-mono text-sm">
						<FolderOpenIcon class="h-4 w-4" />
						<span>Root Class ID: {createClassFuncInput.root_class_id || 'Not Selected'}</span>
					</div>
					<UserClassTree
						nodeClass={data.root}
						ref={data.project.reference}
						bind:selectedID={createClassFuncInput.root_class_id}
					/>
					{#if createClassFuncInput.root_class_id !== ''}
						<Card.Root>
							<Card.Content class="space-y-1">
								<div class="grid grid-cols-5">
									<Card.Description class="col-span-2">Permissions to be check</Card.Description>
									<Field.Field class="col-span-2" orientation="horizontal">
										<Checkbox id="check-permissions" bind:checked={createClassFuncInput.root_check_permission} />
										<Field.Label for="check-permissions">Check Permissions</Field.Label>
									</Field.Field>
									<span class="col-span-1 text-sm italic">Bits {createClassFuncInput.root_check_bits}</span>
								</div>
							</Card.Content>
							<Card.Content>
								<PermissionSelector bind:bits={createClassFuncInput.root_check_bits} />
							</Card.Content>
						</Card.Root>
					{/if}
				</Field.Field>
			</Field.Set>
			<Field.Separator />
			<Field.Set>
				<Field.Legend class="flex items-center gap-2">
					<FolderOpenIcon />
					Class Function Node
				</Field.Legend>
				<Field.Description>Define the structure of the class function API nodes.</Field.Description>
				<Field.Field>
					<ClassFuncNodeEditor bind:node={createClassFuncInput.node} />
				</Field.Field>
			</Field.Set>
		</Field.Set>
	</Field.Group>
</div>
