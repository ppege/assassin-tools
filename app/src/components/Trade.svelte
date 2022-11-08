<script lang="ts">
    import {
        trade,
        inventory,
        code,
        password,
        passwordCorrect,
    } from "./stores";
    import type { item, tradeContainer } from "./stores";
    import { save } from "./save";
    import Item from "./Item.svelte";
    import Paper, { Content, Title } from "@smui/paper";
    import Button, { Label } from "@smui/button";
    import Snackbar, {
        Actions as SnackbarActions,
        Label as SnackbarLabel,
    } from "@smui/snackbar";
    import IconButton from "@smui/icon-button";
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Dialog, {
        Title as DialogTitle,
        Content as DialogContent,
        Actions,
    } from "@smui/dialog";
    import TradeStat from "./TradeStat.svelte";
    $: count = 0;
    const totalAmount = (obj: item[]) => {
        return obj
            .map((obj) => obj.amount)
            .reduce((a: number, b: number) => a + b, 0);
    };
    $: evaluateTrade = () => {
        const combinedValues = {
            top: $trade.top
                .map((obj) => obj.exoticvalue * obj.amount)
                .reduce((a, b) => a + b, 0),
            bottom: $trade.bottom
                .map((obj) => obj.exoticvalue * obj.amount)
                .reduce((a, b) => a + b, 0),
        };
        const combinedDemand = {
            top: $trade.top
                .map(
                    (obj) =>
                        obj.demand
                            .replace(/\u2605/g, "1")
                            .replace(/\u2606/g, "0")
                            .split("")
                            .map(Number)
                            .reduce((a, b) => a + b, 0) * obj.amount
                )
                .reduce((a, b) => a + b, 0),
            bottom: $trade.bottom
                .map(
                    (obj) =>
                        obj.demand
                            .replace(/\u2605/g, "1")
                            .replace(/\u2606/g, "0")
                            .split("")
                            .map(Number)
                            .reduce((a, b) => a + b, 0) * obj.amount
                )
                .reduce((a, b) => a + b, 0),
        };
        return {
            top: {
                value: combinedValues.bottom - combinedValues.top,
                demand:
                    combinedDemand.bottom / totalAmount($trade.bottom) -
                    combinedDemand.top / totalAmount($trade.top),
                eval: combinedValues.top < combinedValues.bottom,
            },
            bottom: {
                value: combinedValues.top - combinedValues.bottom,
                demand:
                    combinedDemand.top / totalAmount($trade.top) -
                    combinedDemand.bottom / totalAmount($trade.bottom),
                eval: combinedValues.bottom < combinedValues.top,
            },
        };
    };
    $: tradeEV = evaluateTrade();
    let open = false;
    let top: boolean = true;
    const applyTrade = async () => {
        const getIndex = (item: item) => {
            return $inventory.findIndex((obj) => {
                return obj.name === item.name;
            });
        };
        const exit = top ? "top" : "bottom";
        const enter = top ? "bottom" : "top";
        for (let item of $trade[enter]) {
            if ($inventory.map((obj) => obj.name).includes(item.name)) {
                $inventory[getIndex(item)].amount += item.amount;
            } else {
                $inventory = [...$inventory, item];
            }
        }
        for (let item of $trade[exit]) {
            if ($inventory.map((obj) => obj.name).includes(item.name)) {
                if ($inventory[getIndex(item)].amount - item.amount <= 0) {
                    $inventory = $inventory.filter((obj) => {
                        return obj.name !== item.name;
                    });
                    continue;
                }
                $inventory[getIndex(item)].amount -= item.amount;
            }
        }
        await save();
        $trade.top = [];
        $trade.bottom = [];
        snackbarWithClose.open();
        setTimeout(() => {
            snackbarWithClose.close();
        }, 3000);
    };
    let snackbarWithClose: SnackbarComponentDev;
</script>

<Snackbar bind:this={snackbarWithClose}>
    <Label>Trade applied!</Label>
    <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
</Snackbar>
<Dialog
    bind:open
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
>
    <div>
        <DialogTitle>Apply trade</DialogTitle>
    </div>
    <DialogContent>
        <p class="underline font-bold">Changes</p>
        <div
            class="bg-zinc-50 outline outline-gray-200 outline-1 rounded p-3 font-mono w-auto"
        >
            <div class="flex flex-row justify-between gap-5">
                <p class="font-bold">Name</p>
                <p class="font-bold">Change</p>
            </div>
            {#each $trade[top ? "top" : "bottom"] as item}
                <div class="flex flex-row justify-between gap-5">
                    <p>
                        -{item.amount}
                        {item.name}
                    </p>
                    <p>
                        -{item.exoticvalue * item.amount}
                    </p>
                </div>
            {/each}
            {#each $trade[top ? "bottom" : "top"] as item}
                <div class="flex flex-row justify-between gap-5">
                    <p>
                        +{item.amount}
                        {item.name}
                    </p>
                    <p>
                        +{item.exoticvalue * item.amount}
                    </p>
                </div>
            {/each}
            <div
                class="w-full outline outline-gray-400 outline-[0.5px] h-min mt-2"
            />
            <div class="flex flex-row justify-between mt-4">
                <p class="font-bold">Total</p>
                <p>
                    {#if tradeEV[top ? "top" : "bottom"].value == 0}
                        -
                    {:else}
                        {tradeEV[top ? "top" : "bottom"].value > 0
                            ? "+"
                            : ""}{tradeEV[top ? "top" : "bottom"].value}
                    {/if}
                </p>
            </div>
        </div>
    </DialogContent>
    <div class="flex flex-row justify-between items-center">
        <Button
            class="ml-2"
            on:click={() => {
                top = !top;
            }}
        >
            <Label>Flip</Label>
        </Button>
        <Actions>
            <Button>
                <Label>Cancel</Label>
            </Button>
            <Button on:click={applyTrade}>
                <Label>Apply</Label>
            </Button>
        </Actions>
    </div>
</Dialog>
<Paper padded>
    <Title class="text-xl font-bold">Trading</Title>
    <Content>
        {#if $trade.top.length > 0 || $trade.bottom.length > 0}
            <Button
                variant="outlined"
                class="mb-2"
                on:click={() => (open = true)}
            >
                <Label>Apply trade</Label>
            </Button>
            <Button
                variant="outlined"
                class="mb-2"
                on:click={() => {
                    $trade.top = [];
                    $trade.bottom = [];
                }}
            >
                <Label>Clear</Label>
            </Button>
            <div class="flex flex-col gap-2">
                <TradeStat trade={tradeEV.top} />
                <div class="trade-section">
                    {#each $trade.top as item}
                        <Item
                            {item}
                            side="top"
                            context="trade"
                            snackbarWithClose={undefined}
                        />
                    {/each}
                </div>
                <div class="trade-section">
                    {#each $trade.bottom as item}
                        <Item
                            {item}
                            side="bottom"
                            context="trade"
                            snackbarWithClose={undefined}
                        />
                    {/each}
                </div>
                <TradeStat trade={tradeEV.bottom} />
            </div>
        {:else}
            <p class="text-zinc-500 dark:text-zinc-400 text-xl">
                Nothing added yet. Use the <button
                    class="item-button-small"
                    on:click={() => count++}>+↑</button
                >
                and
                <button class="item-button-small" on:click={() => count++}
                    >+↓</button
                >
                buttons to add some items to the trade. {count > 3
                    ? "The example buttons don't do anything. The buttons are in the overlay of each item."
                    : ""}
            </p>
        {/if}
    </Content>
</Paper>
