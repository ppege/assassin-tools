<script context="module">
    export const prerender = true;
</script>

<script lang="ts">
    import Inventory from "../components/Inventory.svelte";
    import Search from "../components/Search.svelte";
    import Stats from "../components/Stats.svelte";
    import Trade from "../components/Trade.svelte";
    import Credit from "../components/Credit.svelte";
</script>

<svelte:head>
    <title>Assassin! Tools</title>
</svelte:head>

<body>
    <div
        class="w-full h-screen max-h-screen flex flex-col lg:flex-row p-2 gap-2"
    >
        <div class="flex flex-col gap-2 w-full">
            <div class="fixed top-1 right-2 z-50">
                <Credit/>
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
