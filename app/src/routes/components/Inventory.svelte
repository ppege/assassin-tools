<script lang="ts">
	import { fade } from 'svelte/transition';
    let visible = false;
    let clientX: any;
    let clientY: any;
    const handleMousemove = (e: any) => {
        clientX = e.clientX;
        clientY = e.clientY;
    };
    const handleMouseover = (item: item) => {
        activeItem = item;
        visible = true;
    }
    const handleMouseleave = () => {
        visible = false;
    }
    interface item {
        name: string;
        value: string;
        demand: string;
        rarity: string;
        exoticvalue: number;
        obtain: string;
        origin: string;
        amount: number;
    }
    let activeItem: item
    let output: item[] = []
    const getValues = async () => {
		const itemList = await fetch('https://api.nangurepo.com/v2/assassin?code=nangu')
        .then(x => x.json())
        output = await fetch(`https://api.nangurepo.com/v2/assassin?name=${itemList}`)
        .then(x => x.json())
        output = generateStacks(output)
    }
    const generateStacks = (arr: item[]) => {
        let results = [];
        let prevItem: item = arr[0];
        for (const [i, currentItem] of arr.entries()) {
            if (i===0) {
                continue;
            }
            if (currentItem.name == prevItem.name) {
                if (!isNaN(prevItem.amount)) {
                    prevItem.amount += 1
                } else {
                    prevItem.amount = 2
                }
            } else {
                results.push(prevItem)
                prevItem = currentItem
            }
            if (i == arr.length-1) {
                results.push(prevItem)
            }
        }
        return results
    }
    const colorFromRarity = (rarity: String) => {
        switch (rarity) {
            case "Exotic":
                return "bg-orange-500"
            case "Mythic":
                return "bg-red-600"
            case "Dream":
                return "bg-blue-200"
            default:
                return "bg-slate-300"
        }
    }
    getValues();
</script>

<div class="flex flex-wrap gap-1" on:mousemove={handleMousemove} on:mouseleave={handleMouseleave}>
    {#if output}
        {#each output as item}
            <div
                class="w-auto h-full bg-slate-200"
                on:mouseover={()=>handleMouseover(item)}
                on:focus={()=>handleMouseover(item)}
            >
                {#if item.amount}
                <p class="absolute font-bold">{item.amount}</p>
                {/if}
                <img class="w-32 h-32" src={"images/" + item.name.toUpperCase().replace(/ /g, '_') + ".png"} alt="knife" />
                <div class={`w-full h-auto px-2 ${colorFromRarity(item.rarity)}`}>
                    <p class={`font-semibold text-center ${item.rarity!=="Dream"?"text-white":null} ${item.name.length>=12?"text-sm py-[2px]":"text-md"}`}>{item.name}</p>
                </div>
            </div>
        {/each}
        {#if visible}
            <span class="h-auto shadow-lg p-2 m-2 bg-white/75 backdrop-blur absolute" transition:fade style="left:{clientX}px; top:{clientY}px;">
                <p class="font-bold">{activeItem.name}</p>
                <p>{activeItem.demand}</p>
                <div class="font-bold">
                    {#if isNaN(activeItem.value)}
                        <p>Worth {activeItem.value}</p>
                    {/if}
                    <p>Worth {activeItem.exoticvalue} exotics</p>
                </div>
                <div class="text-xs">
                    <p>{activeItem.rarity}</p>
                    <p>{activeItem.obtain}</p>
                    <p>{activeItem.origin}</p>
                </div>
            </span>
        {/if}
    {/if}
</div>