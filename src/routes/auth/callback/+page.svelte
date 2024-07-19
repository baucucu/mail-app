<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/utils/supabaseClient';

	onMount(async () => {
		const { error } = await supabase.auth.getSession();
		if (error) {
			console.error('Error getting session:', error);
			goto('/');
		} else {
			goto('/app');
		}
	});
</script>

<p>Processing authentication, please wait...</p>
