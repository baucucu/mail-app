<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let debugInfo = '';

	function handleCallback() {
		debugInfo += 'Handling callback...\n';
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const accessToken = params.get('access_token');
		const expiresIn = params.get('expires_in');

		debugInfo += `Access Token: ${accessToken ? 'Present' : 'Not found'}\n`;
		debugInfo += `Expires In: ${expiresIn || 'Not found'}\n`;

		if (accessToken && expiresIn) {
			const expirationTime = Date.now() + parseInt(expiresIn) * 1000;
			const tokenData = JSON.stringify({
				accessToken,
				expirationTime
			});

			try {
				localStorage.setItem('googleDriveToken', tokenData);
				debugInfo += 'Token saved to localStorage\n';
			} catch (error) {
				debugInfo += `Error saving to localStorage: ${error}\n`;
			}
		} else {
			debugInfo += 'Missing token data, not saving to localStorage\n';
		}

		// Delay the redirection to allow seeing the debug info
		setTimeout(() => {
			goto('/app/settings');
		}, 50000);
	}

	onMount(() => {
		debugInfo += 'Component mounted\n';
		handleCallback();
	});
</script>

<h1>OAuth Callback</h1>
<p>Processing OAuth callback... Please wait.</p>
<p>You will be redirected in 5 seconds.</p>

<pre class="mt-4 rounded bg-gray-100 p-4">
	{debugInfo}
  </pre>
