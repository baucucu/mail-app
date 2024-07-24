<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/utils/supabaseClient';
	import type { AuthUser } from '@supabase/supabase-js';

	export let account: null;
	export let role: string;
	export let user: AuthUser;

	let loading = false;

	onMount(async () => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { data: _user } = await supabase.auth.getUser();
			console.log('user from profile page: ', _user);
			user = _user.user;

			const {
				data: user_accounts,
				error,
				status
			} = await supabase
				.from('user_accounts')
				.select('account_id, role')
				.eq('user_id', user.id)
				.single();

			if (error && status !== 406) throw error;
			console.log({ user_accounts });
			role = user_accounts.role;

			const {
				data: _account,
				error: accountError,
				status: accountStatus
			} = await supabase
				.from('accounts')
				.select('name, id')
				.eq('id', user_accounts.account_id)
				.single();

			console.log({ _account });
			account = _account;

			if (accountError && accountStatus !== 406) throw accountError;
		} catch (accountError) {
			if (accountError instanceof Error) {
				alert(accountError.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

{#if !loading}
	<p>Welcome, {user?.user_metadata?.name}</p>
	<p>Email: {user?.email}</p>
	<p>ID: {user?.id}</p>
	<p>Account: {account?.name}</p>
	<p>Account ID: {account?.id}</p>
	<p>Role: {role}</p>
{:else}
	<p>Loading...</p>
{/if}
