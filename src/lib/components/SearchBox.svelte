<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
</script>

<div class="relative w-64 sm:w-80 md:w-96">
	<Search class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={20} />
	<Input
		type="search"
		placeholder="Search..."
		class="h-12 w-full rounded-full py-2 pl-12 pr-4 text-lg"
	/>
</div>
