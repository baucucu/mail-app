<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
</script>

<div class="relative">
	<Search class="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" size={20} />
	<Input type="search" placeholder="Search..." class="w-full py-2 pl-10 pr-4" />
</div>
