import { writable } from 'svelte/store';
import { supabase } from '../lib/supabaseClient';

export const session = writable(null);

supabase.auth.onAuthStateChange((event, sessionData) => {
    session.set(sessionData);
});
