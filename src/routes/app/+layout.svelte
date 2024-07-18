<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';

	const isSidebarOpen = writable(true);
	const isSmallScreen = writable(false);

	function toggleSidebar() {
		$isSidebarOpen = !$isSidebarOpen;
	}

	onMount(() => {
		const checkScreenSize = () => {
			$isSmallScreen = window.innerWidth < 1024;
			$isSidebarOpen = !$isSmallScreen;
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	});

	const breadcrumbs = ['Home', 'Dashboard'];
</script>

<div class="relative flex h-screen bg-zinc-100">
	{#if $isSmallScreen}
		{#if $isSidebarOpen}
			<div class="fixed inset-0 z-40 bg-black bg-opacity-50" on:click={toggleSidebar}></div>
			<div class="fixed bottom-0 left-0 top-0 z-50" transition:slide={{ duration: 300, axis: 'x' }}>
				<Sidebar isCollapsed={false} />
			</div>
		{/if}
	{:else}
		<Sidebar isCollapsed={!$isSidebarOpen} />
	{/if}

	<div class="flex flex-1 flex-col">
		<AppHeader {toggleSidebar} {breadcrumbs} />
		<main class="flex-1 overflow-auto p-4">
			<slot />
		</main>
	</div>
</div>
