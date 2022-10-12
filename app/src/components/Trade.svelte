<script lang="ts">
    import { inventory, trade, defaultItem, selectedRow } from "./stores";
    import Item from "./Item.svelte";
    import Paper, { Content, Title } from "@smui/paper";
</script>

<Paper padded>
    <Title class="text-xl font-bold">Trading</Title>
    <Content>
        <div class="flex flex-col gap-2">
            <div class="trade-section">
                {#each $trade.top as item}
                    <Item
                        {item}
                        context="trade"
                        snackbarWithClose={undefined}
                    />
                {/each}
            </div>
            <div class="trade-section">
                {#each $trade.bottom as item}
                    <Item
                        {item}
                        context="trade"
                        snackbarWithClose={undefined}
                    />
                {/each}
            </div>
        </div>
    </Content>
</Paper>
