<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Menu, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import SearchBox from './SearchBox.svelte';
	import UserAvatar from './UserAvatar.svelte';

	export let toggleSidebar: () => void;
	export let isSmallScreen: boolean;
	export let isSidebarOpen: boolean;
</script>

<header class="flex items-center justify-between bg-white p-4 shadow-sm">
	<div class="flex items-center space-x-4">
		<Button variant="ghost" size="icon" on:click={toggleSidebar}>
			{#if isSmallScreen}
				<Menu size={24} />
			{:else if isSidebarOpen}
				<ChevronLeft size={24} />
			{:else}
				<ChevronRight size={24} />
			{/if}
		</Button>
	</div>

	<SearchBox />
	<div class="flex items-center space-x-4">
		<div class="hidden sm:block"></div>
		<UserAvatar userInitials="JD" />
	</div>
</header>
