<script lang="ts">
    export let trade: any;
</script>

<div class="flex flex-row gap-2">
    {#if trade.value}
        <div
            class="flex flex-row gap-2 rounded p-1 text-black {trade.value > 0
                ? 'bg-green-300'
                : 'bg-red-300'} w-fit h-auto items-center justify-center text-center"
        >
            <p class="font-bold text-md">
                {#if trade.value}
                    {trade.value > 0 ? "+" : ""}{trade.value} exotics
                {:else}
                    -
                {/if}
            </p>
        </div>
    {/if}
    {#if trade.demand}
        <div
            class="flex flex-row gap-2 rounded p-1 text-black {trade.demand > 0
                ? 'bg-green-300'
                : 'bg-red-300'} w-fit h-auto items-center justify-center text-center"
        >
            {#if trade.demand}
                <p class="font-bold text-md">
                    {trade.demand > 0 ? "+" : ""}{trade.demand.toFixed(1)}★
                </p>
            {/if}
        </div>
    {/if}
    {#if trade.demand || trade.value}
        <div
            class="flex flex-row gap-2 rounded p-1 text-black {trade.value
                ? trade.eval
                    ? 'bg-green-300'
                    : 'bg-red-300'
                : trade.demand > 0
                ? 'bg-green-300'
                : 'bg-red-300'} w-fit h-auto items-center justify-center text-center"
        >
            <p class="font-bold rounded px-1 bg-black text-white text-md">
                {#if trade.value}
                    {trade.eval ? "WIN" : "LOSS"}
                {:else}
                    {trade.demand > 0 ? "WIN" : "LOSS"}
                {/if}
            </p>
        </div>
    {/if}
</div>
