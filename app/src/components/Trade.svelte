<script lang="ts">
    import { trade } from "./stores";
    import type { item } from "./stores";
    import Item from "./Item.svelte";
    import Paper, { Content, Title } from "@smui/paper";
    import TradeStat from "./TradeStat.svelte";
    $: count = 0;
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
                    combinedDemand.bottom / $trade.bottom.length -
                    combinedDemand.top / $trade.top.length,
                eval: combinedValues.top < combinedValues.bottom,
            },
            bottom: {
                value: combinedValues.top - combinedValues.bottom,
                demand:
                    combinedDemand.top / $trade.top.length -
                    combinedDemand.bottom / $trade.bottom.length,
                eval: combinedValues.bottom < combinedValues.top,
            },
        };
    };
    $: tradeEV = evaluateTrade();
</script>

<Paper padded>
    <Title class="text-xl font-bold">Trading</Title>
    <Content>
        {#if $trade.top.length > 0 || $trade.bottom.length > 0}
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
