<script lang="ts">
	import { Home, Gauge, Inbox, Users, Settings } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';

	export let isCollapsed = false;
	export let closeSidebar: () => void;

	const navItems = [
		{ icon: Gauge, label: 'Dashboard', href: '/app' },
		{ icon: Inbox, label: 'Inbox', href: '/app/inbox' },
		{ icon: Users, label: 'Users', href: '/app/users' },
		{ icon: Settings, label: 'Settings', href: '/app/settings' }
	];

	$: currentPath = $page.url.pathname;

	function isActive(href: string) {
		if (href === '/app') {
			return currentPath === href;
		}
		return currentPath.startsWith(href);
	}

	function handleNavClick() {
		closeSidebar();
	}
</script>

<nav
	class={cn(
		'flex h-full flex-col bg-zinc-900 text-white transition-all duration-300',
		isCollapsed ? 'w-16' : 'w-64'
	)}
>
	<div class="flex h-14 items-center justify-center border-b border-zinc-700 p-4">
		{#if !isCollapsed}
			<span class="text-xl font-bold">Logo</span>
		{:else}
			<span class="text-xl font-bold">L</span>
		{/if}
	</div>
	<ul class="flex-1 px-2 py-4">
		{#each navItems as item}
			<li class="mb-2">
				<Button
					variant="ghost"
					href={item.href}
					on:click={handleNavClick}
					class={cn(
						'w-full justify-start text-white hover:bg-zinc-800 hover:text-white',
						isCollapsed ? 'px-2' : 'px-4',
						isActive(item.href) ? 'bg-zinc-800' : ''
					)}
				>
					<svelte:component this={item.icon} class="mr-2" size={20} />
					{#if !isCollapsed}
						<span>{item.label}</span>
					{/if}
				</Button>
			</li>
		{/each}
	</ul>
</nav>
