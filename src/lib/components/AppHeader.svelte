<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import SearchBox from './SearchBox.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import UserAvatar from './UserAvatar.svelte';

	export let toggleSidebar: () => void;
	export let breadcrumbs: string[] = [];
</script>

<header class="flex items-center justify-between bg-white p-4 shadow-sm">
	<div class="flex items-center space-x-4">
		<Button variant="ghost" size="icon" on:click={toggleSidebar}>
			<Menu size={24} />
		</Button>

		<Breadcrumbs items={breadcrumbs} />
	</div>

	<div class="flex items-center space-x-4">
		<SearchBox />
		<UserAvatar userInitials="JD" />
	</div>
</header>
