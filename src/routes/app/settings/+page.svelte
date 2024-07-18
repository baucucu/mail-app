<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import ConnectedAccountCard from './ConnectedAccountCard.svelte';
	import SelectedFolderCard from './SelectedFolderCard.svelte';
	import * as GoogleDriveUtils from '$lib/utils/googleDriveUtils';
	import { handleAuthentication } from '$lib/utils/authHandler';

	let isConnected = false;
	let debugInfo = '';
	let accessToken: string | null = null;

	function connectGoogleDrive() {
		window.location.href = GoogleDriveUtils.getAuthUrl();
	}

	function disconnectGoogleDrive() {
		GoogleDriveUtils.clearStoredData();
		accessToken = null;
		isConnected = false;
		debugInfo += 'Disconnected from Google Drive\n';
	}

	function loadGoogleApi() {
		return new Promise<void>((resolve) => {
			const script = document.createElement('script');
			script.src = 'https://apis.google.com/js/api.js';
			script.onload = () => {
				gapi.load('client:auth2', resolve);
			};
			document.body.appendChild(script);
		});
	}

	onMount(async () => {
		debugInfo += 'Component mounted\n';
		await loadGoogleApi();
		const authResult = handleAuthentication();
		accessToken = authResult.accessToken;
		isConnected = authResult.isConnected;
		debugInfo += authResult.debugInfo;
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-8 text-3xl font-bold">Google Drive Settings</h1>

	<div class="grid gap-6 md:grid-cols-2">
		<ConnectedAccountCard
			{accessToken}
			{isConnected}
			onDisconnect={disconnectGoogleDrive}
			onConnect={connectGoogleDrive}
		/>
		<SelectedFolderCard {accessToken} {isConnected} />
	</div>

	<Card class="mt-6">
		<CardHeader>
			<CardTitle>Debug Information</CardTitle>
		</CardHeader>
		<CardContent>
			<pre class="whitespace-pre-wrap text-sm">{debugInfo}</pre>
		</CardContent>
	</Card>
</div>
