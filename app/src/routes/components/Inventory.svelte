<script lang="ts">
    import Item from "./Item.svelte";
    import { fade } from "svelte/transition";
    import { inventory, code, saved } from "./stores";
    import { getValues } from "./getValues";

    $inventory = [];
</script>

<div class="h-full">
    <div class="flex gap-3 w-full justify-center">
        {#if $saved}
            <p
                transition:fade={{ duration: 200 }}
                class="text-gray-400 bg-white rounded shadow-xl text-xl px-4 py-2 absolute top-5 z-50"
            >
                Saved!
            </p>
        {/if}
    </div>
    {#if $inventory.length}
        <div
            class="overflow-scroll h-full flex flex-wrap gap-[0.1rem] justify-center"
            transition:fade={{ duration: 200 }}
        >
            {#each $inventory as item}
            <div class="h-auto">
                <Item {item} context="inventory" />
            </div>
            {/each}
        </div>
    {/if}
</div>
