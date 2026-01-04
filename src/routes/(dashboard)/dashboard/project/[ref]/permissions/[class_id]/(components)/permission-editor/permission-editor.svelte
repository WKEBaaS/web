<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select';
	import type { Permission, ProjectDetail, Role } from '$lib/schemas';
	import { cn } from '$lib/utils';
	import { Check, ChevronsUpDown, Trash2, User, Users } from '@lucide/svelte/icons';
	import { Debounced } from 'runed';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { PERMISSION_DEFINITIONS } from '.';

	interface PermissionEditorProps {
		project: ProjectDetail;
		permission: Permission;
		editing: boolean;
		onRemove?: () => void;
	}

	const initPermission: Permission = {
		class_id: '',
		permission_bits: 0,
		role_type: 'USER',
		role_id: ''
	};

	function toggleBit(bit: number, checked: boolean) {
		if (checked) {
			permission.permission_bits |= bit;
		} else {
			permission.permission_bits &= ~bit;
		}
	}

	let {
		project,
		editing = $bindable(false),
		permission = $bindable(initPermission),
		onRemove = () => {}
	}: PermissionEditorProps = $props();

	// --- Combobox Logic Start ---
	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchValue = $state(''); // 綁定到 Command.Input

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	const debouncedSearch = new Debounced(() => searchValue, 500);
	let roles: Role[] = $state([]);

	// 當搜尋文字改變或類型改變時，觸發搜尋
	$effect(() => {
		if (open && debouncedSearch.current + permission.role_type) {
			const url =
				resolve(`/api/project/[ref]/db-roles`, {
					ref: project.reference
				}) + `?role_type=${permission.role_type}&query=${debouncedSearch.current}`;
			fetch(url)
				.then((res) => res.json())
				.then((data) => {
					roles = data;
				})
				.catch((err) => {
					console.error('Error fetching roles:', err);
					toast.error('無法取得角色列表，請稍後再試。');
				});
		}
	});
</script>

<Card.Root class="p-1">
	<Card.Content class="p-4">
		{#if editing}
			<div class="grid gap-6 md:grid-cols-[220px_1fr_auto]">
				<div class="space-y-4">
					<div class="space-y-2">
						<Label>類型</Label>
						<Select.Root
							type="single"
							bind:value={permission.role_type}
							onValueChange={() => {
								// 當類型改變時，清空當前選擇並重新搜尋
								permission.role_id = '';
								searchValue = '';
							}}
						>
							<Select.Trigger>
								{permission.role_type}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="USER">USER</Select.Item>
								<Select.Item value="GROUP">GROUP</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex flex-col space-y-2">
						<Label>角色 ID (UUID) / 搜尋</Label>

						<Popover.Root bind:open>
							<Popover.Trigger bind:ref={triggerRef}>
								{#snippet child({ props })}
									<Button
										variant="outline"
										class="w-full justify-between font-mono text-xs"
										{...props}
										role="combobox"
										aria-expanded={open}
									>
										{#if permission.role_id}
											<span class="truncate">
												{permission.role_name ?? permission.role_id}
											</span>
										{:else}
											<span class="text-muted-foreground">選擇或輸入 ID...</span>
										{/if}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-55 p-0">
								<Command.Root shouldFilter={false}>
									<Command.Input placeholder="搜尋名稱或 UUID..." bind:value={searchValue} />
									<Command.List>
										{#if debouncedSearch.pending}
											<Command.Loading>搜尋中...</Command.Loading>
										{:else if roles.length === 0}
											<Command.Empty>找不到符合的結果</Command.Empty>
										{/if}

										<Command.Group heading="搜尋結果">
											{#each roles as role (role.id)}
												<Command.Item
													value={role.id}
													onSelect={() => {
														permission.role_id = role.id;
														permission.role_name = role.name;
														// 可以在這裡設定 permission.role_name 如果你的 schema 有這個欄位
														closeAndFocusTrigger();
													}}
												>
													<Check class={cn('mr-2 h-4 w-4', permission.role_id !== role.id && 'text-transparent')} />
													<div class="flex flex-col">
														<span>{role.name}</span>
														<span class="text-muted-foreground font-mono text-[10px]">{role.email}</span>
													</div>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>

					<div class="pt-2">
						<Badge variant="outline" class="w-full justify-center font-mono">
							Total Bits: {permission.permission_bits}
						</Badge>
					</div>
				</div>

				<div class="rounded-md border p-4">
					<Label class="mb-4 block text-base">權限設定</Label>
					<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
						{#each PERMISSION_DEFINITIONS as def (def.bit)}
							<div class="flex flex-row items-start space-y-0 space-x-3">
								<Checkbox
									checked={(permission.permission_bits & def.bit) === def.bit}
									onCheckedChange={(checked) => toggleBit(def.bit, checked as boolean)}
								/>
								<div class="grid gap-1.5 leading-none">
									<Label
										class="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{def.label}
									</Label>
									<p class="text-muted-foreground font-mono text-[0.8rem]">
										{def.name} ({def.bit})
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="flex items-start">
					<Button size="icon" variant="ghost" onclick={onRemove} class="text-destructive hover:text-destructive">
						<Trash2 class="h-4 w-4" />
					</Button>
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					{#if permission.role_type === 'USER'}
						<div class="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
							<User class="text-primary h-6 w-6" />
						</div>
					{:else}
						<div class="bg-secondary/50 flex h-12 w-12 items-center justify-center rounded-lg">
							<Users class="h-6 w-6" />
						</div>
					{/if}

					<div class="flex flex-col">
						<div class="flex items-center gap-2">
							<Badge variant={permission.role_type === 'USER' ? 'default' : 'secondary'} class="h-5 px-1.5 text-[10px]">
								{permission.role_type}
							</Badge>
							<h4 class="mb-1 text-lg leading-none font-semibold">
								{permission.role_name || '(未命名角色)'}
							</h4>
							<code class="text-muted-foreground font-mono text-xs">
								{permission.role_id}
							</code>
						</div>

						<div class="mt-2 flex flex-wrap gap-1">
							{#each PERMISSION_DEFINITIONS as def (def.bit)}
								{#if (permission.permission_bits & def.bit) === def.bit}
									<Badge variant="outline" class="text-xs">
										{def.label}
									</Badge>
								{/if}
							{/each}
							{#if permission.permission_bits === 0}
								<span class="text-muted-foreground text-sm">無權限</span>
							{/if}
						</div>
					</div>
				</div>

				<div class="pl-4 text-right">
					<Badge variant="secondary" class="font-mono">
						bits: {permission.permission_bits}
					</Badge>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
