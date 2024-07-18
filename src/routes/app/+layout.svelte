<script>
	import { Button } from '$lib/components/ui/button';
	import { slide } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { Inbox, Send, FileEdit, Menu, X } from 'lucide-svelte';

	const isSidebarOpen = writable(true);
	const isSmallScreen = writable(false);

	function toggleSidebar() {
		$isSidebarOpen = !$isSidebarOpen;
	}

	function checkScreenSize() {
		$isSmallScreen = window.innerWidth < 640; // Adjust this breakpoint as needed
		if ($isSmallScreen) {
			$isSidebarOpen = false;
		}
	}

	$: if (typeof window !== 'undefined') {
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
	}
</script>

<div class="relative flex h-screen">
	<!-- Sidebar for large screens -->
	{#if !$isSmallScreen}
		<nav
			class="flex flex-col bg-gray-100 transition-all duration-300"
			class:w-64={$isSidebarOpen}
			class:w-16={!$isSidebarOpen}
		>
			<ul>
				<li>
					<Button
						variant="ghost"
						class="mb-2 w-full justify-start {$isSidebarOpen ? 'px-4' : 'px-2'}"
					>
						<Inbox class="mr-2" size={20} />
						{#if $isSidebarOpen}<span>Inbox</span>{/if}
					</Button>
				</li>
				<li>
					<Button
						variant="ghost"
						class="mb-2 w-full justify-start {$isSidebarOpen ? 'px-4' : 'px-2'}"
					>
						<Send class="mr-2" size={20} />
						{#if $isSidebarOpen}<span>Sent</span>{/if}
					</Button>
				</li>
				<li>
					<Button
						variant="ghost"
						class="mb-2 w-full justify-start {$isSidebarOpen ? 'px-4' : 'px-2'}"
					>
						<FileEdit class="mr-2" size={20} />
						{#if $isSidebarOpen}<span>Drafts</span>{/if}
					</Button>
				</li>
			</ul>
		</nav>
	{/if}

	<!-- Overlay sidebar for small screens -->
	{#if $isSmallScreen && $isSidebarOpen}
		<div class="fixed inset-0 z-40 bg-black bg-opacity-50" on:click={toggleSidebar}></div>
		<nav
			class="fixed left-0 top-0 z-50 h-full w-64 bg-gray-100 p-4"
			transition:slide={{ duration: 300, axis: 'x' }}
		>
			<Button variant="ghost" class="absolute right-4 top-4" on:click={toggleSidebar}>
				<X size={24} />
			</Button>
			<ul class="mt-16">
				<li>
					<Button variant="ghost" class="mb-2 w-full justify-start"
						><Inbox class="mr-2" size={20} />Inbox</Button
					>
				</li>
				<li>
					<Button variant="ghost" class="mb-2 w-full justify-start"
						><Send class="mr-2" size={20} />Sent</Button
					>
				</li>
				<li>
					<Button variant="ghost" class="mb-2 w-full justify-start"
						><FileEdit class="mr-2" size={20} />Drafts</Button
					>
				</li>
			</ul>
		</nav>
	{/if}

	<!-- Main content area with header -->
	<div class="flex flex-1 flex-col">
		<header class="flex items-center justify-between bg-white p-4 shadow-sm">
			<Button variant="ghost" on:click={toggleSidebar}>
				<Menu size={24} />
			</Button>
			<h1 class="text-xl font-semibold">Your App Name</h1>
		</header>
		<main class="flex-1 overflow-auto p-4">
			<slot />
		</main>
	</div>
</div>
