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

	export let userInitials: string = 'U';
	export let userImage: string | undefined = undefined;

	function handleLogout() {
		console.log('Logging out...');
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
