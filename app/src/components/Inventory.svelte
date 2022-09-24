<script lang="ts">
    import Item from "./Item.svelte";
    import { fade } from "svelte/transition";
    import { inventory, code, codeDialog } from "./stores";
    import ActionsButton from "./Actions.svelte";
    import { getValues } from "./getValues";
    import Paper, { Title } from "@smui/paper";
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Snackbar, { Actions, Label } from "@smui/snackbar";
    import Button from "@smui/button";
    import IconButton from "@smui/icon-button";

    let snackbarWithClose: SnackbarComponentDev;

    $inventory = [];
</script>

<Paper class="h-full">
    <div class="flex flex-row justify-between items-center">
        <Title>Inventory</Title>
        <p
            class="text-gray-400 text-sm font-mono"
            on:click={() => ($codeDialog = true)}>
            {$code}
        </p>
        <ActionsButton />
    </div>
    <div class="flex gap-3 w-full justify-center">
        <Snackbar bind:this={snackbarWithClose}>
            <Label>Inventory saved.</Label>
            <Actions>
                <IconButton class="material-icons" title="Dismiss">
                    close
                </IconButton>
            </Actions>
        </Snackbar>
    </div>
    {#if $inventory.length}
        <div
            class="mt-1 overflow-scroll h-[95%] flex flex-wrap gap-1"
            transition:fade={{ duration: 200 }}
        >
            {#each $inventory as item}
                <div class="h-auto w-auto">
                    <Item {item} {snackbarWithClose} context="inventory" />
                </div>
            {/each}
        </div>
    {/if}
    {#if !$code}
        <div
            class="text-center text-gray-400 select-none w-full h-full flex flex-col items-center justify-center"
            transition:fade={{ duration: 200 }}
        >
            <div class="material-icons text-9xl">search</div>
            <p class="mb-1">You haven't set your inventory code.</p>
            <Button variant="outlined" on:click={() => ($codeDialog = true)}
                >Set inventory code</Button
            >
        </div>
    {/if}
</Paper>
