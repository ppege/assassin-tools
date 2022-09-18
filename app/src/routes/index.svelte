<script lang="ts">
    import Inventory from "./components/Inventory.svelte";
    import Search from "./components/Search.svelte";
    import Stats from "./components/Stats.svelte";
    import Trade from "./components/Trade.svelte";
</script>

<body>
    <div class="w-full h-screen max-h-screen flex flex-col lg:flex-row p-1">
        <div class="flex flex-col w-full">
            <div class="h-[70vh]">
                <Inventory />
            </div>
            <div class="h-auto flex flex-row gap-1">
                <div class="w-full h-full">
                    <Stats />
                </div>
            </div>
        </div>
        <div class="flex flex-col w-full">
            <div class="h-1/2">
                <Search />
            </div>
            <!-- <div class="h-1/2">
                <Trade />
            </div> -->
        </div>
    </div>
</body>
