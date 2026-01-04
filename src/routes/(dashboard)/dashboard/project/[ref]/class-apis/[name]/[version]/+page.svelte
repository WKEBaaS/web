<script lang="ts">
	import { PermissionSelector } from '$lib/components/permission-selector/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { UserClassTree } from '$lib/components/user-class-tree';
	// Using update function
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Select from '$lib/components/ui/select/index.js';
	import { createClassFunc } from '$lib/remotes/index.js';
	import { CreateClassFuncStore } from '$lib/stores/index.js';
	import { ExternalLinkIcon, FolderOpenIcon, PencilIcon, SaveIcon, XIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { ClassFuncNodeEditor } from '../../(components)/classfunc-node-editor/index.js';

	let { data } = $props();

	// let pendingFunc = $derived(data.func);
	let version = $derived(data.func.version.toString());
	let editing = $state(false);

	const pendingFunc = $derived(new CreateClassFuncStore(data.func));
	const docsLink = $derived(new URL(`/api/rest/docs/#tag/rpc-${data.func.name.toLowerCase()}`, data.projectURL));

	function handleEdit() {
		// Create a restore point before editing starts
		editing = true;
	}

	function handleCancel() {
		// Revert to the saved state
		// pendingFunc = $state.snapshot(data.func);
		pendingFunc.set(data.func);
		editing = false;
	}

	async function handleSave() {
		try {
			editing = false;
			const res = await createClassFunc(pendingFunc.value());
			if (res.success) {
				toast.success('Updated successfully!');
			}
		} catch (e) {
			console.error('Failed to save', e);
		}
	}
</script>

<div class="flex w-full flex-col p-3 pb-96 font-mono">
	<Field.Group>
		<div class="bg-background/95 sticky top-0 z-10 mb-4 flex items-center justify-between border-b py-2 backdrop-blur">
			<div class="flex flex-col">
				<Field.Legend>
					<span class="mr-auto"> Class Function API </span>
					<Button
						target="_blank"
						href={docsLink.toString()}
						variant="outline"
						size="sm"
						class="border-border text-foreground hover:bg-muted"
					>
						<ExternalLinkIcon class="mr-2 size-3" />
						Open Docs
					</Button>
				</Field.Legend>
				<div class="flex items-center gap-2 text-xs">
					<span class="text-muted-foreground">ID: {data.func.name}</span>
					<span class="text-muted-foreground">/</span>
					<span class={editing ? 'font-bold text-amber-500' : 'text-emerald-600'}>
						{editing ? 'EDITING' : 'PREVIEW'}
					</span>
				</div>
			</div>

			<div class="flex gap-2">
				{#if !editing}
					<Button variant="outline" size="sm" onclick={handleEdit}>
						<PencilIcon class="mr-2 h-4 w-4" />
						Edit
					</Button>
				{:else}
					<Button variant="ghost" size="sm" onclick={handleCancel}>
						<XIcon class="mr-2 h-4 w-4" />
						Cancel
					</Button>
					<Button variant="default" size="sm" onclick={handleSave}>
						<SaveIcon class="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				{/if}
			</div>
		</div>

		<Field.Set>
			<Field.Group>
				<div class="grid grid-cols-5 gap-4">
					<Field.Field class="col-span-4">
						<Field.Label for="function-name">Function Name</Field.Label>
						<Input id="function-name" bind:value={pendingFunc.name} disabled={!editing} />
					</Field.Field>
					<Field.Field class="col-span-1">
						<Field.Label for="function-version">Version</Field.Label>
						{#if editing}
							<Input id="function-version" bind:value={pendingFunc.version} type="number" />
						{:else}
							<Select.Root
								type="single"
								bind:value={version}
								onValueChange={(val) => {
									goto(
										resolve(`/(dashboard)/dashboard/project/[ref]/class-apis/[name]/[version]`, {
											ref: data.project.reference,
											name: data.func.name,
											version: val
										})
									);
								}}
							>
								<Select.Trigger>{version}</Select.Trigger>
								<Select.Content>
									{#each data.funcVersions as ver (ver)}
										<Select.Item value={ver.toString()}>
											{ver}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/if}
					</Field.Field>
				</div>
				<Field.Field>
					<Field.Label for="function-description">Description</Field.Label>
					<Textarea class="h-32" id="function-description" bind:value={pendingFunc.description} disabled={!editing} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Checkbox id="function-need-auth" bind:checked={pendingFunc.authenticated} disabled={!editing} />
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
						<span>Root Class ID: {pendingFunc.root_class_id || 'Not Selected'}</span>
					</div>
					{#if editing}
						<UserClassTree
							nodeClass={data.root}
							ref={data.project.reference}
							bind:selectedID={pendingFunc.root_class_id}
						/>
					{/if}

					{#if pendingFunc.root_class_id !== ''}
						<Card.Root class="mt-4">
							<Card.Content class="space-y-1">
								<div class="grid grid-cols-5">
									<Card.Description class="col-span-2">Permissions to be checked</Card.Description>
									<Field.Field class="col-span-2" orientation="horizontal">
										<Checkbox
											id="check-permissions"
											bind:checked={pendingFunc.root_check_permission}
											disabled={!editing}
										/>
										<Field.Label for="check-permissions">Check Permissions</Field.Label>
									</Field.Field>
									<span class="col-span-1 text-sm italic">Bits {pendingFunc.root_check_bits}</span>
								</div>
							</Card.Content>
							<Card.Content>
								<div class={!editing ? 'pointer-events-none opacity-70' : ''}>
									<PermissionSelector bind:bits={pendingFunc.root_check_bits} />
								</div>
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
					<div class={!editing ? 'pointer-events-none opacity-80 grayscale-[0.3]' : ''}>
						<ClassFuncNodeEditor bind:node={pendingFunc.node} />
					</div>
				</Field.Field>
			</Field.Set>
		</Field.Set>
	</Field.Group>
</div>
