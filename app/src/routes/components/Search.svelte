<script lang="ts">
    import Item from "./Item.svelte"
	import { fade } from 'svelte/transition';
    import { visible } from "./stores"
    import type { item } from './stores'

    $: query = ""
    let results: item[] = []
    $: noResults = false
    const handleMouseleave = () => {
        $visible = false;
    }
    const search = async (query: string) => {
        results = await fetch(`https://api.nangurepo.com/v2/assassin?limit=50&name=${query}`)
        .then(x => x.json())
        if (!results.length) {
            noResults = true
        }
        if ("ERROR" in results) {
            results = []
        }
    }
	let timer: any;
	const debounce = () => {
        results = []
        noResults = false
		clearTimeout(timer);
		timer = setTimeout(() => {
			search(query)
		}, 500);
	}
</script>

<div class="p-5 w-full h-auto items-center justify-center dark:text-white">
    <input class="rounded px-5 py-3 w-full bg-slate-200 dark:bg-slate-700" placeholder="Search..." bind:value={query} on:keyup={debounce}>
    {#if results.length}
        <div class="mt-1 flex flex-wrap gap-1 justify-center" on:mouseleave={handleMouseleave} transition:fade={{ duration: 200 }}>
            {#each results as item}
            <Item item={item} context="search"/>
            {/each}
        </div>
    {/if}
    {#if noResults && query}
        <h1 class="text-slate-400 font-bold z-50 text-2xl text-center mt-5" transition:fade={{ duration: 200 }}>
            🔎 No results found 🤷🏼‍♂️
        </h1>
    {/if}
</div>