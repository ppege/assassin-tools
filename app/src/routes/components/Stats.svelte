<script lang="ts">
    import { inventory, code } from "./stores";
    import { getValues } from "./getValues";
    import StatCard from "./StatCard.svelte";
    let timer: any;
    const debounce = () => {
        $inventory = [];
        clearTimeout(timer);
        timer = setTimeout(async () => {
            $inventory = await getValues($code);
        }, 750);
    };
    debounce();
    const getDemandNumber = (demand: string): number => {
        let arr: number[] = [];
        demand.split("").forEach((char) => {
            arr.push(char == "\u2605" ? 1 : 0);
        });
        return arr.reduce((a, b) => a + b);
    };
</script>

<div class="default relative w-full h-auto rounded p-2">
    <input
        class="absolute right-1 -top-4 text-center rounded mt-5 px-5 py-2 h-fit align-bottom w-auto default bg-white dark:bg-slate-800"
        placeholder="Inventory code"
        bind:value={$code}
        on:keyup={debounce}
    />
    <div class="max-w-[75ch] mx-auto px-5">
        <h1 class="text-xl font-bold">Stats</h1>
        <div class="flex flex-wrap w-3/4 gap-2">
            <StatCard
                title="Total value"
                value={$inventory
                    .map((obj) => {
                        return typeof obj.exoticvalue == "number"
                            ? obj.exoticvalue
                            : 0;
                    })
                    .reduce((a, b) => a + b, 0) + " exotics"}
            />
            <StatCard
                title="Average demand"
                value={$inventory.length
                    ? $inventory
                          .map((obj) => {
                              return getDemandNumber(obj.demand);
                          })
                          .reduce((a, b) => a + b) / $inventory.length
                    : 0}
            />
            <StatCard
                title="Item count"
                value={$inventory
                    .map((obj) => {
                        return typeof obj.amount == "number" ? obj.amount : 1;
                    })
                    .reduce((a, b) => a + b, 0)}
            />
            <StatCard title="Unique item count" value={$inventory.length} />
        </div>
    </div>
</div>
