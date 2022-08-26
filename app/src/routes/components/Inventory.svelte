<script lang="ts">
    import Item from "./Item.svelte"
	import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate'
    import { inventory, code } from "./stores"
    import type { item } from './stores'

    let output: item[] = []
    $inventory = []
    const getValues = async () => {
        output = []
		const itemList = await fetch(`https://api.nangurepo.com/v2/assassin?code=${$code}`)
        .then(x => x.json())
        output = await fetch(`https://api.nangurepo.com/v2/assassin?limit=1&name=${itemList}`)
        .then(x => x.json())
        for (let [i, obj] of output.entries()) {
            obj.id = i
        }
        if (!Array.isArray(output)) {
            output = []
        }
        $inventory = generateStacks(output)
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
        for (const obj of arr) {
            if (!obj.amount) {
                obj.amount = 1;
            }
        }
        return results
    }
	let timer: any;
	const debounce = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			getValues();
		}, 750);
	}
    getValues();
</script>

<div>
    <div class="flex justify-center">
        <input class="text-center rounded mt-5 px-5 py-3 w-auto justify-center bg-slate-200 dark:bg-slate-700 dark:text-white" placeholder="Inventory code" bind:value={$code} on:keyup={debounce}>
    </div>
    {#if $inventory.length}
        <div
            class="mt-1 flex flex-wrap gap-1 justify-center"
            transition:fade={{ duration: 200 }}
        >
            {#each $inventory as item (item.id)}
                <div
                    class="table"
                    animate:flip={{duration:100}}
                >
                    <Item item={item} context="inventory"/>
                </div>
            {/each}
        </div>
    {/if}
</div>