// src/lib/googleDriveUtils.ts

export const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
export const SCOPE =
	'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

export function getAuthUrl() {
	return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;
}

export function saveToken(accessToken: string, expiresIn: string): void {
	const expirationTime = Date.now() + parseInt(expiresIn) * 1000;
	const tokenData = JSON.stringify({ accessToken, expirationTime });
	localStorage.setItem('googleDriveToken', tokenData);
}

export function getStoredToken(): { accessToken: string; expirationTime: number } | null {
	const tokenData = localStorage.getItem('googleDriveToken');
	if (tokenData) {
		return JSON.parse(tokenData);
	}
	return null;
}

export function clearStoredData(): void {
	localStorage.removeItem('googleDriveToken');
	localStorage.removeItem('selectedGoogleDriveFolder');
}

export function isTokenValid(expirationTime: number): boolean {
	return Date.now() < expirationTime;
}
