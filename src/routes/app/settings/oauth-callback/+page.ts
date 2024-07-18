import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	// If there's a hash in the URL, let the client-side script handle it
	if (url.hash) {
		return {};
	}

	// If there's no hash, redirect to the settings page
	throw redirect(307, '/app/settings');
};
