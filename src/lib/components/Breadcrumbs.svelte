<script lang="ts">
	export let items: string[] = [];
</script>

<nav aria-label="Breadcrumb" class="hidden sm:block">
	<ol class="flex items-center space-x-2">
		{#each items as item, index}
			<li>
				{#if index !== 0}
					<span class="mx-2 text-gray-500">/</span>
				{/if}
				<a href="#{item.toLowerCase()}" class="text-gray-600 hover:text-gray-900">
					{item}
				</a>
			</li>
		{/each}
	</ol>
</nav>
