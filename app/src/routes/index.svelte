<script context="module">
    export const prerender = true;
</script>

<script lang="ts">
    import Inventory from "../components/Inventory.svelte";
    import Search from "../components/Search.svelte";
    import Stats from "../components/Stats.svelte";
    import Trade from "../components/Trade.svelte";
    import Credit from "../components/Credit.svelte";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import { tutorialStep } from "../components/stores";
</script>

<svelte:head>
    <title>Assassin! Tools</title>
</svelte:head>

<body>
    <div
        class="w-full h-screen max-h-screen flex flex-col lg:flex-row p-2 gap-2"
    >
        <Dialog open={$tutorialStep == 0}>
            <Title>Assassin Tools</Title>
            <Content>
                <p>Welcome to Assassin Tools. Assassin Tools is:</p>
                <ul class="list-disc list-inside">
                    <li>An inventory manager</li>
                    <li>A trade calculator</li>
                    <li>An item lookup utility</li>
                    <li>And so much more.</li>
                </ul>
                <p class="max-w-[40ch] mt-[1ch]">
                    We're going to walk you through the features and UI so you
                    don't get lost.
                </p>
            </Content>
            <Actions>
                <Button on:click={() => ($tutorialStep = -1)}>
                    <Label>Skip</Label>
                </Button>
                <Button on:click={() => $tutorialStep++}>
                    <Label>Begin tutorial</Label>
                </Button>
            </Actions>
        </Dialog>
        <div class="flex flex-col gap-2 w-full">
            <div class="fixed top-1 right-2 z-50">
                <Credit />
            </div>
            <div class="lg:hidden">
                <Search />
            </div>
            <div class="h-[70vh]">
                <Inventory />
            </div>
            <div class="h-auto flex flex-row">
                <div class="w-full h-full">
                    <Stats />
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-2 w-full">
            <div class="h-auto hidden lg:flex">
                <Search />
            </div>
            <div>
                <Trade />
            </div>
        </div>
    </div>
</body>
