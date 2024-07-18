import * as GoogleDriveUtils from './googleDriveUtils';

export interface AuthResult {
	accessToken: string | null;
	isConnected: boolean;
	debugInfo: string;
}

export function handleAuthentication(): AuthResult {
	let debugInfo = 'Checking URL hash params...\n';
	let accessToken: string | null = null;
	let isConnected = false;

	const hash = window.location.hash.substring(1);
	const params = new URLSearchParams(hash);
	const newAccessToken = params.get('access_token');
	const expiresIn = params.get('expires_in');

	if (newAccessToken && expiresIn) {
		debugInfo += 'Token found in URL\n';
		try {
			GoogleDriveUtils.saveToken(newAccessToken, expiresIn);
			accessToken = newAccessToken;
			isConnected = true;
			debugInfo += 'Token saved to localStorage\n';
		} catch (error) {
			debugInfo += `Error saving to localStorage: ${error}\n`;
		}
		history.replaceState(null, document.title, window.location.pathname + window.location.search);
	} else {
		debugInfo += 'No token found in URL\n';
		const result = checkStoredToken();
		accessToken = result.accessToken;
		isConnected = result.isConnected;
		debugInfo += result.debugInfo;
	}

	return { accessToken, isConnected, debugInfo };
}

function checkStoredToken(): AuthResult {
	let debugInfo = 'Checking token in localStorage...\n';
	let accessToken: string | null = null;
	let isConnected = false;

	const storedToken = GoogleDriveUtils.getStoredToken();
	if (storedToken) {
		debugInfo += 'Token found in localStorage\n';
		debugInfo += `Token expiration: ${new Date(storedToken.expirationTime)}\n`;
		if (GoogleDriveUtils.isTokenValid(storedToken.expirationTime)) {
			accessToken = storedToken.accessToken;
			isConnected = true;
			debugInfo += 'Token is valid\n';
		} else {
			debugInfo += 'Token has expired\n';
			GoogleDriveUtils.clearStoredData();
		}
	} else {
		debugInfo += 'No token found in localStorage\n';
	}

	return { accessToken, isConnected, debugInfo };
}
