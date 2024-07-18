<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Menu, X } from 'lucide-svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	const isSidebarOpen = writable(true);
	const isSmallScreen = writable(false);

	function toggleSidebar() {
		$isSidebarOpen = !$isSidebarOpen;
	}

	function checkScreenSize() {
		$isSmallScreen = window.innerWidth < 1024; // Adjust this breakpoint as needed
		if ($isSmallScreen) {
			$isSidebarOpen = false;
		}
	}

	$: if (typeof window !== 'undefined') {
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
	}
</script>

<div class="relative flex h-screen bg-zinc-100">
	{#if !$isSmallScreen}
		<Sidebar isCollapsed={!$isSidebarOpen} />
	{/if}

	{#if $isSmallScreen && $isSidebarOpen}
		<div class="fixed inset-0 z-40 bg-black bg-opacity-50" on:click={toggleSidebar}></div>
		<div class="fixed bottom-0 left-0 top-0 z-50" transition:slide={{ duration: 300, axis: 'x' }}>
			<Sidebar isCollapsed={false} />
			<Button variant="ghost" class="absolute right-4 top-4 text-white" on:click={toggleSidebar}>
				<X size={24} />
			</Button>
		</div>
	{/if}

	<div class="flex flex-1 flex-col">
		<header class="flex items-center justify-between bg-white p-4 shadow-sm">
			<Button variant="ghost" on:click={toggleSidebar}>
				<Menu size={24} />
			</Button>
			<h1 class="text-xl font-semibold">Dashboard</h1>
		</header>
		<main class="flex-1 overflow-auto p-4">
			<slot />
		</main>
	</div>
</div>
