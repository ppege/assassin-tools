<script lang="ts">
    import { tutorialStep } from "./stores";
    import Button, { Label } from "@smui/button";
    export let title: string;
    export let bodyText: string;
    export let step: number;
</script>

{#if $tutorialStep == step}
    <div
        class="p-4 rounded-xl outline outline-1 outline-gray-300 shadow-lg bg-white dark:bg-zinc-900 dark:text-white"
    >
        <h1 class="text-2xl font-bold">{title}</h1>
        <p class="max-w-[30ch]">{bodyText}</p>
        <div class="mt-2 flex flex-row w-full justify-end">
            {#if $tutorialStep == 4}
                <Button
                    on:click={() => {
                        $tutorialStep = -1;
                        localStorage.setItem("tutorialStep", "-1");
                    }}>Got it</Button
                >
            {:else}
                <Button on:click={() => $tutorialStep++}>Next</Button>
            {/if}
        </div>
    </div>
{/if}
