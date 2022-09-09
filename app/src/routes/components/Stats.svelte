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
    $: averageDemand = $inventory.length
        ? (
              $inventory
                  .map((obj) => {
                      return getDemandNumber(obj.demand) * obj.amount;
                  })
                  .reduce((a, b) => a + b) /
              $inventory.map((obj) => obj.amount).reduce((a, b) => a + b)
          ).toFixed(3)
        : 0;
    $: valueDensity = $inventory.length
        ? (
              $inventory
                  .map((obj) => {
                      return typeof obj.exoticvalue == "number"
                          ? obj.exoticvalue * obj.amount
                          : 0;
                  })
                  .reduce((a, b) => a + b, 0) /
              $inventory.map((obj) => obj.amount).reduce((a, b) => a + b)
          ).toFixed(3)
        : 0;
    $: getTradability = (): number => {
        const demandScore = (averageDemand / 5) * 100;
        const densityScore = (valueDensity / 30) * 100;
        return (demandScore + densityScore) / 2;
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
        <div class="flex flex-wrap gap-2 w-2/3 mt-4">
            <StatCard
                title="Total value"
                value={$inventory
                    .map((obj) => {
                        return typeof obj.exoticvalue == "number"
                            ? obj.exoticvalue * obj.amount
                            : 0;
                    })
                    .reduce((a, b) => a + b, 0) + " exotics"}
            />
            <StatCard
                title="Value density"
                tag={{ text: "?", description: "The average value per knife" }}
                value={valueDensity}
            />
            <StatCard title="Average demand" value={averageDemand} />
            <StatCard
                title="Average demand"
                tag={{
                    text: "exotic+",
                    description:
                        "Only counts demand of exotics, mythics and dreams",
                }}
                value={$inventory.length
                    ? (
                          $inventory
                              .map((obj) => {
                                  return obj.rarity == "Exotic" ||
                                      obj.rarity == "Mythic" ||
                                      obj.rarity == "Dream"
                                      ? getDemandNumber(obj.demand) * obj.amount
                                      : 0;
                              })
                              .reduce((a, b) => a + b) /
                          $inventory
                              .map((obj) =>
                                  obj.rarity == "Exotic" ||
                                  obj.rarity == "Mythic" ||
                                  obj.rarity == "Dream"
                                      ? obj.amount
                                      : 0
                              )
                              .reduce((a, b) => a + b)
                      ).toFixed(3)
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
            <StatCard
                title="Item count"
                tag={{
                    text: "unique",
                    description: "Unique items in your inventory - no stacks",
                }}
                value={$inventory.length}
            />
            <StatCard title="Tradability" value={getTradability().toFixed(3) + "%"} />
        </div>
    </div>
</div>
