<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import AutoScroll from 'embla-carousel-auto-scroll';

	import * as m from '$lib/paraglide/messages';
	import { CloudIcon, CogIcon, DatabaseIcon, HardDriveIcon, KeyIcon } from '@lucide/svelte';

	const features = [
		{
			title: m.feat_i3s(),
			description: m.feat_i3s_description(),
			icon: DatabaseIcon
		},
		{
			title: m.feat_auth(),
			description: m.feat_auth_description(),
			icon: KeyIcon
		},
		{
			title: m.feat_storage(),
			description: m.feat_storage_description(),
			icon: HardDriveIcon
		},
		{
			title: m.feat_auto_api(),
			description: m.feat_auto_api_description(),
			icon: CogIcon
		},
		{
			title: 'Cloud Native',
			description:
				'Built on Kubernetes infrastructure ensuring high availability, scalability, and resilience for your BaaS.',
			icon: CloudIcon
		}
	];
</script>

<section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex flex-col items-center space-y-4 text-center">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
					{m.welcome()}
				</h1>
				<p class="mx-auto max-w-175 text-gray-500 md:text-xl dark:text-gray-400">
					{m.welcome_description()}
				</p>
			</div>
			<div class="space-x-4">
				<a href={resolve('/dashboard/projects')} class={buttonVariants({ variant: 'default' })}>{m.get_started()}</a>
				<Button variant="outline">{m.learn_more()}</Button>
			</div>
		</div>
	</div>
</section>

<section class="w-full overflow-hidden bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-gray-800">
	<div class="w-full px-0">
		<h2 class="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
			{m.features()}
		</h2>

		<Carousel.Root
			plugins={[AutoScroll({ speed: 1 })]}
			class="w-full"
			opts={{
				loop: true
			}}
		>
			<Carousel.Content class="-ml-4">
				{#each features as f (f.title)}
					<Carousel.Item class="basis-[80%] pl-4 md:basis-[50%] lg:basis-[30%]">
						<div class="h-full p-1 select-none">
							<Card.Root
								class="hover:ring-sidebar-ring h-full transition-all duration-300 hover:scale-y-105 hover:cursor-pointer hover:shadow-lg"
							>
								<Card.Header class="flex flex-row items-center gap-4">
									<f.icon class="h-8 w-8" />
									<Card.Title class="text-lg">{f.title}</Card.Title>
								</Card.Header>
								<Card.Content>
									<p class="text-muted-foreground text-sm">{f.description}</p>
								</Card.Content>
							</Card.Root>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</div>
</section>
