<script lang="ts">
    import Tooltip, { Wrapper } from "@smui/tooltip";
    interface tag {
        text: string;
        description: string;
    }
    export let title: string;
    export let value: string | number;
    export let tag: tag | null = null;
    export let styling: string | null = null;
</script>

<div
    class="rounded h-auto w-fit px-2 py-1 shadow default bg-white dark:bg-slate-800"
>
    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
    </p>
    <div class="flex flex-row container items-center gap-1">
        <p class="font-semibold text-gray-700 dark:text-gray-100">{value}</p>
        {#if tag}
            <Wrapper>
                <div
                    tabindex="0"
                    class="rounded h-fit w-fit px-1 bg-red-400 {!styling
                        ? 'text-white'
                        : ''} dark:text-black {styling}"
                >
                    <p class="text-xs shadow-sm select-none">{tag.text}</p>
                </div>
                <Tooltip>{tag.description}</Tooltip>
            </Wrapper>
        {/if}
    </div>
</div>
