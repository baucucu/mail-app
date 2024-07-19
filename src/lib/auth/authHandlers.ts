import { supabase } from '$lib/utils/supabaseClient';

async function handleAuth() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });

    if (error) throw error;

    // The user will be redirected to Google for authentication
}

export { handleAuth }