<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	export let accessToken: string | null;
	export let isConnected: boolean;
	export let onDisconnect: () => void;
	export let onConnect: () => void;

	let userInfo: { email: string; name: string; picture: string } | null = null;
	let lastSyncTime = 'Not available';
	let storageUsage = 'Not available';
	let isLoading = false;

	async function fetchUserInfo() {
		if (!accessToken) return;

		try {
			const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: { Authorization: `Bearer ${accessToken}` }
			});
			if (!response.ok) throw new Error('Failed to fetch user info');
			userInfo = await response.json();
		} catch (error) {
			console.error('Error fetching user info:', error);
		}
	}

	async function fetchDriveInfo() {
		if (!accessToken) return;

		try {
			const response = await fetch(
				'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
				{
					headers: { Authorization: `Bearer ${accessToken}` }
				}
			);
			if (!response.ok) throw new Error('Failed to fetch drive info');
			const data = await response.json();
			const { limit, usage } = data.storageQuota;
			storageUsage = `${(usage / 1024 / 1024 / 1024).toFixed(2)} GB / ${(limit / 1024 / 1024 / 1024).toFixed(2)} GB`;
		} catch (error) {
			console.error('Error fetching drive info:', error);
		}
	}

	function updateLastSyncTime() {
		lastSyncTime = new Date().toLocaleString();
	}

	async function loadAccountInfo() {
		isLoading = true;
		await Promise.all([fetchUserInfo(), fetchDriveInfo()]);
		updateLastSyncTime();
		isLoading = false;
	}

	$: if (isConnected && accessToken) {
		loadAccountInfo();
	}

	onMount(() => {
		if (isConnected && accessToken) {
			loadAccountInfo();
		}
	});
</script>

<Card class="flex flex-col">
	<CardHeader>
		<CardTitle>Connected Account</CardTitle>
		<CardDescription>Your Google Drive account information.</CardDescription>
	</CardHeader>
	<CardContent class="flex-grow">
		{#if isLoading}
			<p>Loading account information...</p>
		{:else if isConnected && userInfo}
			<div class="mb-4 flex items-center space-x-4">
				<img src={userInfo.picture} alt="Profile" class="h-16 w-16 rounded-full" />
				<div>
					<p class="text-lg font-medium">{userInfo.name}</p>
					<p class="text-sm text-gray-500">{userInfo.email}</p>
				</div>
			</div>
			<p class="text-sm text-gray-700">Last synchronized: {lastSyncTime}</p>
			<p class="text-sm text-gray-700">Storage used: {storageUsage}</p>
		{:else}
			<p>No account connected</p>
		{/if}
	</CardContent>
	<CardFooter>
		<Button
			variant={isConnected ? 'destructive' : 'default'}
			on:click={isConnected ? onDisconnect : onConnect}
		>
			{isConnected ? 'Disconnect' : 'Connect Google Drive'}
		</Button>
	</CardFooter>
</Card>
