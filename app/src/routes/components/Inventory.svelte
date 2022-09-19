<script lang="ts">
    import Item from "./Item.svelte";
    import { fade } from "svelte/transition";
    import { inventory, code, codeDialog } from "./stores";
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
    <Title>Inventory</Title>
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
            class="text-center text-gray-400 mt-40 select-none w-full"
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
