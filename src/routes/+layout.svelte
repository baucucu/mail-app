<script>
	import '../app.css';

	import { supabase } from '$lib/utils/supabaseClient';
	import { goto } from '$app/navigation';

	async function checkExistingUser(email) {
		const { data: users, error } = await supabase.from('users').select('id').eq('email', email);
		if (error) {
			console.error('Error checking existing user:', error);
			return null;
		}
		if (users.length > 0) {
			return users[0].id;
		} else {
			return null;
		}
	}

	async function createUserRecord(id, email) {
		// Create record in public.users table
		const { data: user, error } = await supabase.from('users').insert([{ id, email }]).select();
		console.log({ user, error });
	}

	async function createAccountRecord() {
		// Create record in accounts table
		const { data: account, error: accountError } = await supabase
			.from('accounts')
			.insert([{ name: 'New account' }])
			.select();
		console.log({ account, accountError });
		return account[0].id;
	}

	async function createUserAccountRecord(user_id, account_id) {
		// Create record in account_users table
		const { data: userAccount, error: userAccountError } = await supabase
			.from('user_accounts')
			.insert([{ user_id, account_id, role: 'admin' }])
			.select();
		console.log({ userAccount, userAccountError });
	}

	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log({ event });
		if (event === 'SIGNED_IN') {
			console.log({ session });
			const { user } = session;
			const { email, id } = user;
			console.log({ email, id });
			const user_id = await checkExistingUser(email);
			if (!user_id) {
				await createUserRecord(id, email);
				const account = await createAccountRecord();
				await createUserAccountRecord(id, account);
			}
		}
		if (event === 'SIGNED_OUT') {
			goto('/');
		}
	});
</script>

<slot></slot>
