<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { browser } from '$app/environment';
	import { supabase } from '$lib/utils/supabaseClient';
	import { goto } from '$app/navigation';

	const isSidebarOpen = writable(true);
	const isSmallScreen = writable(false);
	let isClientSide = false;

	function toggleSidebar() {
		$isSidebarOpen = !$isSidebarOpen;
	}

	function closeSidebar() {
		if ($isSmallScreen) {
			$isSidebarOpen = false;
		}
	}

	async function checkAuth() {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (!session) {
			goto('/');
		}
	}

	onMount(() => {
		checkAuth();
		isClientSide = true;
		const checkScreenSize = () => {
			$isSmallScreen = window.innerWidth < 1024;
			if ($isSmallScreen) {
				$isSidebarOpen = false;
			}
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	});
</script>

{#if browser && isClientSide}
	<div class="relative flex h-screen bg-zinc-100">
		{#if $isSmallScreen}
			{#if $isSidebarOpen}
				<div
					class="fixed inset-0 z-40 bg-black bg-opacity-50"
					on:click={toggleSidebar}
					on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
					role="button"
					tabindex="0"
				></div>
				<div
					class="fixed bottom-0 left-0 top-0 z-50"
					transition:slide={{ duration: 300, axis: 'x' }}
				>
					<Sidebar isCollapsed={false} {closeSidebar} />
				</div>
			{/if}
		{:else}
			<Sidebar isCollapsed={!$isSidebarOpen} {closeSidebar} />
		{/if}

		<div class="flex flex-1 flex-col">
			<AppHeader {toggleSidebar} isSmallScreen={$isSmallScreen} isSidebarOpen={$isSidebarOpen} />
			<main class="flex-1 overflow-auto p-4">
				<slot />
			</main>
		</div>
	</div>
{:else}
	<div>Loading...</div>
{/if}
