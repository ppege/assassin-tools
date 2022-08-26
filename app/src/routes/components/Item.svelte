<script lang="ts">
	import { fade } from 'svelte/transition';
    import { inventory } from './stores'
    import type { item } from './stores'
    export let context: string;
    export let item: item;
    let visible = false;
    $: image = item.name.toUpperCase().replace(/ /g, '_')
    const colorFromRarity = (rarity: String) => {
        switch (rarity) {
            case "Common":
                return "bg-green-300"
            case "Rare":
                return "bg-blue-400"
            case "Legendary":
                return "bg-purple-600"
            case "Exotic":
                return "bg-orange-500"
            case "Mythic":
                return "bg-red-600"
            case "Dream":
                return "bg-blue-200"
            default:
                return "bg-black"
        }
    }
    const handleMouseover = () => {
        visible = true;
    }
    const handleMouseleave = () => {
        visible = false;
    }
    const handleImgError = () => {
        image = "DEFAULT";
    }
    const handlePlus = () => {
        if (context=="inventory") {
            item.amount++;
        } else if (context=="search") {
            const index = $inventory.findIndex(obj => {
                return obj.name === item.name
            })
            if (index != -1) {
                $inventory[index].amount++
                return;
            }
            item.id = $inventory[$inventory.length-1].id + 1
            item.amount = 1
            let tempInv: item[] = [item, ...$inventory]
            tempInv.sort((a, b) => a.name.localeCompare(b.name))
            tempInv.sort((a, b) => (a.exoticvalue > b.exoticvalue) ? 1 : -1)
            for (let [i, obj] of tempInv.entries()) {
                obj.id = i
            }
            $inventory = tempInv
        }
    }
    const handleMinus = () => {
        if (item.amount != 1) {
            item.amount--;
            return;
        }
        $inventory = $inventory.filter((obj) => {
            return obj.name !== item.name;
        })
    }
</script>

<div class="w-auto h-full">
    <div
        class="w-full h-full relative block bg-slate-200 dark:bg-slate-700"
        on:mouseover={handleMouseover}
        on:focus={handleMouseover}
        on:mouseleave={handleMouseleave}
    >
        {#if visible}
            <div class="absolute block top-0 bottom-0 left-0 right-0 p-1 bg-white/25 dark:bg-slate-600/25 dark:text-white backdrop-blur z-10" transition:fade={{ duration: 100 }}>
                <div class="absolute right-1 bottom-1 flex flex-col">
                    <button class="item-button-small" on:click={handlePlus}>+</button>
                    {#if context == "inventory"}
                        <button class="item-button-small" on:click={handleMinus}>-</button>
                    {/if}
                </div>
                <div class="absolute top-1 w-10/12">
                    <p class="{String(item.origin).length>=25?"text-[0.5rem]":"text-xs"}">
                        {item.origin}
                    </p>
                    <p class="text-[0.4rem]">
                        {item.obtain}
                    </p>
                </div>
                <div class="absolute bottom-1">
                    <p class="text-xs">{item.rarity}</p>
                    <div class="font-bold text-sm">
                        {#if isNaN(item.value)}
                        <p>Worth {item.value}</p>
                        {/if}
                        {#if item.exoticvalue !== "Unknown"}
                        <p>{item.exoticvalue} exotics</p>
                        {/if}
                    </div>
                    <p>{item.demand}</p>
                </div>
            </div>
        {/if}
        {#if item.amount !== 1 && context == "inventory"}
            <p class="absolute right-1 top-[0.1rem] font-mono font-bold z-20 dark:text-white">
                {item.amount}
            </p>
        {/if}
        <img on:error={handleImgError} class="w-32 h-auto" src={"images/" + image + ".png"} alt="knife" />
    </div>
    <div class={`w-full h-auto px-2 ${colorFromRarity(item.rarity)}`}>
        <p class={`font-semibold text-center ${item.rarity!=="Dream"?"text-white":null} ${item.name.length>=12?"text-sm py-[2px]":"text-md"}`}>{item.name}</p>
    </div>
</div>