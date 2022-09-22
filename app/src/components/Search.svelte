<script lang="ts">
    import Item from "./Item.svelte";
    import { fade } from "svelte/transition";
    import type { item } from "./stores";
    import { Input } from "@smui/textfield";
    import Paper from "@smui/paper";
    import Fab from "@smui/fab";
    import { Icon } from "@smui/common";

    $: query = "";
    let results: item[] = [];
    $: noResults = false;
    const search = async (query: string) => {
        results = await fetch(
            `https://api.nangurepo.com/v2/assassin?limit=50&name=${query}`
        ).then((x) => x.json());
        if (!results.length) {
            noResults = true;
        }
        if ("ERROR" in results) {
            results = [];
        }
    };
    let timer: any;
    const debounce = () => {
        results = [];
        noResults = false;
        clearTimeout(timer);
        timer = setTimeout(() => {
            search(query);
        }, 500);
    };
</script>

<div class="p-5 w-full h-auto items-center justify-center">
    <div class="flex justify-center items-center">
        <Paper
            class="flex items-center flex-grow max-w-[600px] p-3 h-12"
            elevation={6}
        >
            <Icon class="material-icons">search</Icon>
            <Input
                bind:value={query}
                on:keyup={debounce}
                placeholder="Search"
                class="flex-grow ml-2 dark:text-white placeholder:opacity-60"
            />
        </Paper>
    </div>
    {#if results.length}
        <div
            class="mt-1 flex flex-wrap gap-[0.1rem] justify-center"
            transition:fade={{ duration: 200 }}
        >
            {#each results as item}
                <Item {item} context="search" />
            {/each}
        </div>
    {/if}
    {#if noResults && query}
        <h1
            class="text-slate-400 font-bold z-50 text-2xl text-center mt-5"
            transition:fade={{ duration: 200 }}
        >
            🔎 No results found 🤷🏼‍♂️
        </h1>
    {/if}
</div>
