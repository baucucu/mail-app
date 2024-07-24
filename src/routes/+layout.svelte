<script>
	import '../app.css';

	import { supabase } from '$lib/utils/supabaseClient';

	const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
		if (event === 'SIGNED_IN') {
			console.log({ session });
			const { user } = session;
			const { email, id } = user;
			console.log({ email, id });

			// Check if user exists in public.users table
			const { data: userData, error: userError } = await supabase
				.from('users')
				.select('*')
				.eq('email', email);

			if (userError) {
				console.log(userError);
			}
			console.log({ userData });

			if (userData.length === 0) {
				// Create record in public.users table
				const { data: user, error } = await supabase.from('users').insert([{ id, email }]).select();
				console.log({ user, error });

				// Create record in accounts table
				const { data: account, error: accountError } = await supabase
					.from('accounts')
					.insert([{ name: 'New account' }])
					.select();
				if (accountError) {
					console.log(error || accountError);
				}
				console.log({ account });

				// Create record in user_accounts table
				const { data: user_accounts, error: user_accountsError } = await supabase
					.from('user_accounts')
					.insert([{ user_id: id, account_id: account[0].id, role: 'admin' }])
					.select();
				if (user_accountsError) {
					console.log(user_accountsError);
				}
				console.log({ user_accounts });
			}
		}
		// Cleanup auth listener on component destroy
		return () => {
			authListener.unsubscribe();
		};
	});
</script>

<slot></slot>
