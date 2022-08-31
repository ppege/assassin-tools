<script lang="ts">
    import Inventory from "./components/Inventory.svelte";
    import Search from "./components/Search.svelte";
    import Stats from "./components/Stats.svelte";
    import Trade from "./components/Trade.svelte";
</script>

<body class="dark:bg-slate-800">
    <div class="w-full h-screen max-h-screen grid grid-cols-2">
        <div class="h-1/2">
            <Inventory />
        </div>
        <div class="h-1/2">
            <Search />
        </div>
        <div class="h-1/2">
            <Stats />
        </div>
        <div class="h-1/2">
            <Trade />
        </div>
    </div>
</body>
