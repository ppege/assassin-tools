<script lang="ts">
    import Item from "./Item.svelte";
    import { fade } from "svelte/transition";
    import { inventory, code, saved } from "./stores";
    import { getValues } from "./getValues";

    $inventory = [];
    let timer: any;
    const debounce = () => {
        $inventory = [];
        clearTimeout(timer);
        timer = setTimeout(async () => {
            $inventory = await getValues($code);
        }, 750);
    };
    debounce();
</script>

<div>
    <div class="flex gap-3 w-full justify-center">
        {#if $saved}
            <p
                transition:fade={{ duration: 200 }}
                class="text-gray-400 text-sm absolute"
            >
                Saved!
            </p>
        {/if}
        <input
            class="text-center rounded mt-5 px-5 py-2 h-fit align-bottom w-auto justify-center default"
            placeholder="Inventory code"
            bind:value={$code}
            on:keyup={debounce}
        />
    </div>
    <div
        class="overflow-scroll flex flex-wrap gap-1 justify-center"
        transition:fade={{ duration: 200 }}
    >
        {#if $inventory.length}
            {#each $inventory as item}
                <Item {item} context="inventory" />
            {/each}
        {/if}
    </div>
</div>
