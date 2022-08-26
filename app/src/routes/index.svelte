<script lang="ts">
    import Inventory from "./components/Inventory.svelte"
    import Search from "./components/Search.svelte"
    import { x, y } from "./components/stores"
    const handleMousemove = (e: any) => {
        $x = e.clientX;
        $y = e.clientY;
    };
</script>
<body class="dark:bg-slate-800" on:mousemove={handleMousemove}>
    <div class="w-full h-full flex divide-x">
        <div class="m-1 w-1/2">
            <Inventory/>
        </div>
        <div class="m-1 w-1/2">
            <Search/>
        </div>
    </div>
</body>