<script>
	import { Button } from '$lib/components/ui/button';
	import { GithubIcon } from 'lucide-svelte';
	import { handleAuth } from '$lib/auth/authHandlers';

	let loading = false;
	let errorMessage = null;
</script>

<div class="flex min-h-screen flex-col">
	<header class="flex h-14 items-center px-4 lg:px-6">
		<a class="flex items-center justify-center" href="/">
			<GithubIcon class="h-6 w-6" />
			<span class="sr-only">Acme Inc</span>
		</a>
		<nav class="ml-auto flex gap-4 sm:gap-6">
			<a class="text-sm font-medium underline-offset-4 hover:underline" href="#"> Features </a>
			<a class="text-sm font-medium underline-offset-4 hover:underline" href="#"> Pricing </a>
			<a class="text-sm font-medium underline-offset-4 hover:underline" href="#"> About </a>
			<a class="text-sm font-medium underline-offset-4 hover:underline" href="#"> Contact </a>
		</nav>
	</header>
	<main class="flex-1">
		<section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
			<div class="container px-4 md:px-6">
				<div class="flex flex-col items-center space-y-4 text-center">
					<div class="space-y-2">
						<h1
							class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
						>
							Welcome to My App
						</h1>
						<p class="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
							Discover amazing features and boost your productivity with our innovative solution.
						</p>
					</div>
					<div class="w-full max-w-sm space-y-2">
						<Button class="w-full" on:click={handleAuth} disabled={loading} variant="outline">
							{#if loading}
								Processing...
							{:else}
								Get Started with Google
							{/if}
						</Button>
						{#if errorMessage}
							<p class="text-sm text-red-500">{errorMessage}</p>
						{/if}
					</div>
				</div>
			</div>
		</section>
	</main>
</div>
