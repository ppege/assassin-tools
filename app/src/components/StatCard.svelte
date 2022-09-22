<script lang="ts">
    import Tooltip, { Wrapper } from "@smui/tooltip";
    import Card, { Content } from "@smui/card";
    interface tag {
        text: string;
        description: string;
    }
    export let title: string;
    export let value: string | number;
    export let tag: tag | null = null;
    export let styling: string | null = null;
</script>

<div class="p-2 outline outline-gray-200 dark:outline-gray-700 rounded shadow-md">
    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
    </p>
    <div class="flex flex-row container items-center gap-1">
        <p class="font-semibold text-gray-700 dark:text-gray-100">
            {value}
        </p>
        {#if tag}
            <Wrapper>
                <div
                    tabindex="0"
                    class="rounded h-fit w-fit px-1 {!styling
                        ? 'text-white bg-red-400'
                        : ''} dark:text-black {styling}"
                >
                    <p class="text-xs shadow-sm select-none">{tag.text}</p>
                </div>
                <Tooltip>
                    <p class="text-md">{tag.description}</p></Tooltip
                >
            </Wrapper>
        {/if}
    </div>
</div>
