<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { updateUsersClassPermissions } from '$lib/remotes/users-class.remote.js';
	import type { Permission } from '$lib/schemas';
	import { Plus, Save, Shield } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { PermissionEditor } from './(components)/permission-editor/index.js';

	let { data } = $props();

	let editing = $state(false);
	let saving = $state(false);

	// eslint-disable-next-line svelte/prefer-writable-derived
	let permissions: Permission[] = $state([]);
	$effect(() => {
		permissions = data.permissions;
	});

	function addPermission() {
		permissions.push({
			class_id: data.classData.id,
			permission_bits: 0,
			role_type: 'USER',
			role_id: ''
		});
	}

	function removePermission(index: number) {
		permissions = permissions.filter((_, i) => i !== index);
	}

	async function savePermissions() {
		saving = true;
		try {
			// await new Promise(resolve => setTimeout(resolve, 1000));
			const res = await updateUsersClassPermissions({
				ref: page.params.ref!,
				class_id: data.classData.id,
				permissions: permissions
			});
			if (res.success) {
				toast.success('權限已成功儲存');
			} else {
				toast.error(`儲存權限時發生錯誤`);
			}
			editing = false;
		} finally {
			saving = false;
		}
	}
</script>

<div class="container mx-auto max-w-5xl space-y-6 p-6">
	<div class="flex items-center justify-between">
		<div class="space-y-1">
			<div class="flex items-center gap-3">
				<Shield class="text-muted-foreground h-8 w-8" />
				<div>
					<h1 class="text-3xl font-bold tracking-tight">權限管理</h1>
					<p class="text-muted-foreground text-sm">
						{data.classData.chinese_name || data.classData.english_name || data.classData.id}
					</p>
				</div>
			</div>
		</div>

		{#if !editing}
			<Button onclick={() => (editing = true)}>編輯權限</Button>
		{:else}
			<div class="flex gap-2">
				<Button variant="outline" onclick={() => (editing = false)}>取消</Button>
				<Button disabled={saving} onclick={savePermissions}>
					<Save class="mr-2 h-4 w-4" />
					{saving ? '儲存中...' : '儲存'}
				</Button>
			</div>
		{/if}
	</div>

	<Separator />

	<div class="space-y-4 pb-150">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold">權限列表</h2>
			{#if editing}
				<Button size="sm" variant="outline" onclick={addPermission}>
					<Plus class="mr-2 h-4 w-4" />
					新增權限
				</Button>
			{/if}
		</div>

		{#if permissions.length === 0}
			<Card.Card>
				<Card.Content class="flex flex-col items-center justify-center py-12">
					<Shield class="text-muted-foreground/50 mb-4 h-12 w-12" />
					<p class="text-muted-foreground">尚未設定權限</p>
					{#if editing}
						<Button class="mt-4" variant="outline" onclick={addPermission}>
							<Plus class="mr-2 h-4 w-4" />
							新增第一個權限
						</Button>
					{/if}
				</Card.Content>
			</Card.Card>
		{:else}
			<div class="space-y-3">
				<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each permissions as _, i (i)}
					<PermissionEditor
						project={data.project}
						bind:permission={permissions[i]}
						bind:editing
						onRemove={() => removePermission(i)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
