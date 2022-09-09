<script lang="ts">
    import { fade } from "svelte/transition";
    interface tag {
        text: string;
        description: string;
    }
    export let title: string;
    export let value: string | number;
    export let tag: tag | null = null;
    let visible: boolean = false;
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
            <div
                on:mouseenter={() => (visible = true)}
                on:mouseleave={() => (visible = false)}
                on:focus={() => (visible = true)}
                class="rounded h-fit w-fit px-1 bg-red-400 text-white dark:text-black"
            >
                <p class="text-xs shadow-sm select-none">{tag.text}</p>
            </div>
            {#if visible}
                <div
                    class="absolute mb-24 bg-black/50 backdrop-blur-sm text-white break-words max-w-[20ch] rounded h-auto w-auto px-1 py-1"
                    transition:fade={{ duration: 100 }}
                >
                    <p>{tag.description}</p>
                </div>
            {/if}
        {/if}
    </div>
</div>
