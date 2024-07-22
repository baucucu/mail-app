// src/routes/api/signup.js
import { supabase } from '$lib/utils/supabaseClient';

export async function POST({ request }) {
    const { email, password } = await request.json();

    // Sign up the user with Supabase Auth
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return {
            status: 400,
            body: { error: error.message }
        };
    }

    // Perform additional server-side logic here
    // e.g., creating a account, sending a welcome email, etc.
    try {
        // Example: Create a new account
        const { data: account, error: accountError } = await supabase
            .from('accounts')
            .insert([{ name: 'New account', created_by: user.id }])
            .select()
            .single();

        if (accountError) throw accountError;

        // Example: Associate the user with the new account as an admin
        const { error: userError } = await supabase
            .from('account_users')
            .insert([{ account_id: account.id, user_id: user.id, role: 'admin' }]);

        if (userError) throw userError;

        return {
            status: 200,
            body: { user }
        };
    } catch (error) {
        return {
            status: 500,
            body: { error: error.message }
        };
    }
}
