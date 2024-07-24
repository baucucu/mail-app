<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { supabase } from '$lib/utils/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let userInitials: string = '';
	export let userImage: string | undefined = undefined;

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Error signing out:', error);
		goto('/');
	}

	function getInitials(name: string) {
		// Split the name into an array of words
		let words = name.trim().split(' ');

		// Map over the array to get the first letter of each word and join them
		let initials = words.map((word: string) => word[0].toUpperCase()).join('');

		return initials;
	}

	async function getUser() {
		const { data, error } = await supabase.auth.getUser();
		if (error) console.error('Error getting user:', error);
		if (data.user) {
			console.log('User data from avatar component:', data.user);
			userInitials = getInitials(data.user.user_metadata.full_name);
			userImage = data.user.user_metadata.picture;
		}
	}

	onMount(async () => {
		getUser();
	});
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		<Button variant="ghost" size="icon" class="rounded-full">
			<Avatar>
				<AvatarImage src={userImage} alt="User avatar" />
				<AvatarFallback>{userInitials}</AvatarFallback>
			</Avatar>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		<DropdownMenuLabel>My Account</DropdownMenuLabel>
		<DropdownMenuSeparator />
		<DropdownMenuItem on:click={() => goto('/app/profile')}>Profile</DropdownMenuItem>
		<DropdownMenuItem>Settings</DropdownMenuItem>
		<DropdownMenuSeparator />
		<DropdownMenuItem on:click={handleLogout}>Log out</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
