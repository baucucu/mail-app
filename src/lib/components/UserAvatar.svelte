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

	export let userInitials: string = 'U';
	export let userImage: string | undefined = undefined;

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Error signing out:', error);
		goto('/');
	}
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
		<DropdownMenuItem>Profile</DropdownMenuItem>
		<DropdownMenuItem>Settings</DropdownMenuItem>
		<DropdownMenuSeparator />
		<DropdownMenuItem on:click={handleLogout}>Log out</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
