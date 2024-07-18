<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';

	export let accessToken: string | null;
	export let isConnected: boolean;

	let selectedFolder: { id: string; name: string; path: string } | null = null;
	let isLoading = false;
	let isPickerLoaded = false;
	let folderType: 'own' | 'all' = 'own';
	let isSelectingNew = false;

	async function loadSavedFolder() {
		const savedFolder = localStorage.getItem('selectedGoogleDriveFolder');
		if (savedFolder) {
			selectedFolder = JSON.parse(savedFolder);
			if (!selectedFolder.path) {
				await fetchFolderPath(selectedFolder.id);
			}
		}
	}

	async function fetchFolderPath(folderId: string) {
		if (!accessToken) return;

		isLoading = true;
		try {
			const response = await fetch(
				`https://www.googleapis.com/drive/v3/files/${folderId}?fields=name,parents`,
				{
					headers: { Authorization: `Bearer ${accessToken}` }
				}
			);
			if (!response.ok) throw new Error('Failed to fetch folder info');
			const folder = await response.json();
			let path = folder.name;
			let parentId = folder.parents?.[0];

			while (parentId) {
				const parentResponse = await fetch(
					`https://www.googleapis.com/drive/v3/files/${parentId}?fields=name,parents`,
					{
						headers: { Authorization: `Bearer ${accessToken}` }
					}
				);
				if (!parentResponse.ok) throw new Error('Failed to fetch parent folder info');
				const parent = await parentResponse.json();
				path = `${parent.name} > ${path}`;
				parentId = parent.parents?.[0];
			}

			selectedFolder = { ...selectedFolder, path };
			saveFolderToLocalStorage();
		} catch (error) {
			console.error('Error fetching folder path:', error);
		} finally {
			isLoading = false;
		}
	}

	function saveFolderToLocalStorage() {
		if (selectedFolder) {
			localStorage.setItem('selectedGoogleDriveFolder', JSON.stringify(selectedFolder));
		}
	}

	function loadPickerApi() {
		return new Promise((resolve) => {
			gapi.load('picker', { callback: resolve });
		});
	}

	async function createPicker() {
		if (!accessToken || !isPickerLoaded) return;

		let view;
		if (folderType === 'own') {
			view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
				.setIncludeFolders(true)
				.setSelectFolderEnabled(true)
				.setOwnedByMe(true)
				.setLabel('My Folders');
		} else {
			view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
				.setIncludeFolders(true)
				.setSelectFolderEnabled(true)
				.setLabel('All Folders');
		}

		const picker = new google.picker.PickerBuilder()
			.addView(view)
			.setOAuthToken(accessToken)
			.setCallback(pickerCallback)
			.build();
		picker.setVisible(true);
	}

	function pickerCallback(data: any) {
		if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
			const folder = data[google.picker.Response.DOCUMENTS][0];
			selectedFolder = { id: folder.id, name: folder.name, path: '' };
			saveFolderToLocalStorage();
			fetchFolderPath(folder.id);
			isSelectingNew = false;
		}
	}

	function resetFolderSelection() {
		selectedFolder = null;
		isSelectingNew = true;
		localStorage.removeItem('selectedGoogleDriveFolder');
	}

	onMount(async () => {
		await loadPickerApi();
		isPickerLoaded = true;
		await loadSavedFolder();
	});
</script>

<Card class="flex flex-col">
	<CardHeader>
		<CardTitle>Selected Folder</CardTitle>
		<CardDescription>The folder that will be used for synchronization.</CardDescription>
	</CardHeader>
	<CardContent class="flex-grow">
		{#if isLoading}
			<p>Loading folder information...</p>
		{:else if selectedFolder && !isSelectingNew}
			<p class="mb-2 text-lg font-medium">{selectedFolder.name}</p>
			<p class="mb-2 text-sm text-gray-500">Path: {selectedFolder.path || 'Loading...'}</p>
			<p class="text-sm text-gray-500">Folder ID: {selectedFolder.id}</p>
		{:else}
			<p class="text-lg font-medium">No folder selected</p>
		{/if}

		{#if !selectedFolder || isSelectingNew}
			<div class="mt-4">
				<RadioGroup bind:value={folderType}>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="own" id="own" />
						<Label for="own">Show only my folders</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="all" id="all" />
						<Label for="all">Show all accessible folders</Label>
					</div>
				</RadioGroup>
			</div>
		{/if}
	</CardContent>
	<CardFooter class="flex justify-between">
		{#if selectedFolder && !isSelectingNew}
			<Button variant="outline" on:click={resetFolderSelection}>Reset Folder</Button>
			<Button on:click={() => (isSelectingNew = true)}>Change Folder</Button>
		{:else}
			<Button on:click={createPicker} disabled={!isConnected || !isPickerLoaded}>
				Select Folder
			</Button>
		{/if}
	</CardFooter>
</Card>
