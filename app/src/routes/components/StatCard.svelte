<script lang="ts">
    export let title: string;
    export let value: string | number;
    export let tag: string | null = null;
</script>

<div
    class="rounded h-auto w-fit px-2 py-1 shadow default bg-white dark:bg-slate-800"
>
    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
    </p>
    <div class="flex flex-row items-center gap-1">
        <p class="font-semibold text-gray-700 dark:text-gray-100">{value}</p>
        {#if tag}
            <div class="rounded h-fit w-fit px-1 bg-red-400 text-white dark:text-black">
                <p class="text-xs shadow-sm">{tag}</p>
            </div>
        {/if}
    </div>
</div>
