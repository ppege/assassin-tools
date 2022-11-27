<script lang="ts">
    import Item from "./Item.svelte";
    import { fade } from "svelte/transition";
    import { inventory, code, codeDialog, passwordCorrect } from "./stores";
    import ActionsButton from "./Actions.svelte";
    import { getValues } from "./getValues";
    import Paper, { Title } from "@smui/paper";
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Snackbar, { Actions, Label } from "@smui/snackbar";
    import Button from "@smui/button";
    import IconButton from "@smui/icon-button";

    let snackbarWithClose: SnackbarComponentDev;

    $inventory.items = [];
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
    {#if $inventory.items.length}
        <div
            class="mt-1 overflow-scroll scrollbar-hide h-[95%] grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-1 p-1 w-auto"
            transition:fade={{ duration: 200 }}
        >
            {#each $inventory.items as item}
                <div class="h-auto w-full">
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
            <div class="material-icons" style="font-size: 8rem; line-height: 1;">search</div>
            <p class="mb-1">You haven't set your inventory code.</p>
            <Button variant="outlined" on:click={() => ($codeDialog = true)}
                >Set inventory code</Button
            >
        </div>
    {/if}
    {#if $inventory.meta.private && !$passwordCorrect}
        <div
            class="text-center text-gray-400 select-none w-full h-full flex flex-col items-center justify-center"
            transition:fade={{ duration: 200 }}
        >
            <div class="material-icons" style="font-size: 8rem; line-height: 1;">visibility_off</div>
            <p class="mb-1">This inventory is private. Enter the password to see it.</p>
        </div>
    {/if}
</Paper>
