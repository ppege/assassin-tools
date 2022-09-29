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
        for (const obj of results) {
            obj.attr = {
                trading: false,
                favorite: false
            }
        }
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
            class="mt-1 flex flex-wrap gap-[0.1rem] overflow-scroll h-[35vh] justify-center"
            transition:fade={{ duration: 200 }}
        >
            {#each results as item}
                <Item {item} snackbarWithClose={undefined} context="search" />
            {/each}
        </div>
    {/if}
    {#if noResults && query}
        <div
            class="text-center text-gray-400 dark:text-zinc-600 select-none w-full h-full flex flex-col items-center justify-center mt-10"
            transition:fade={{ duration: 200 }}
        >
            <div class="text-9xl material-icons">search</div>
            <p class="mb-1">No results found.</p>
        </div>
    {/if}
</div>
