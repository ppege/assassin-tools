<script lang="ts">
    import { getValues } from "./getValues";
    import { fade } from "svelte/transition";
    import { inventory, code, saved } from "./stores";
    import type { item } from "./stores";
    export let context: string;
    export let item: item;
    let visible = false;
    $: image = item.name.toUpperCase().replace(/ /g, "_");
    const colorFromRarity = (rarity: String) => {
        switch (rarity) {
            case "Common":
                return "to-green-300";
            case "Rare":
                return "to-blue-400";
            case "Legendary":
                return "to-purple-600";
            case "Exotic":
                return "to-orange-500";
            case "Mythic":
                return "to-red-500";
            case "Dream":
                return "to-blue-200";
            default:
                return "to-black";
        }
    };
    const handleMouseover = () => {
        visible = true;
    };
    const handleMouseleave = () => {
        visible = false;
    };
    const handleImgError = () => {
        image = "DEFAULT";
    };
    const getIndex = () => {
        return $inventory.findIndex((obj) => {
            return obj.name === item.name;
        });
    };
    let timer: any;
    const debounce = (func: Function) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            func();
        }, 750);
    };
    const announceSaved = () => {
        $saved = true;
        setTimeout(() => {
            $saved = false;
        }, 2000);
    };
    const save = async () => {
        const names = $inventory.map((obj) => obj.name);
        for (const obj of $inventory) {
            if (obj.amount > 1) {
                for (let i = 1; i < obj.amount; i++) {
                    names.push(obj.name);
                }
            }
        }
        fetch(
            `https://api.nangurepo.com/v2/assassin?code=${$code}&name=${names}`
        ).then(async () => {
            $inventory = await getValues($code);
            announceSaved();
        });
    };
    const handlePlus = () => {
        const index = getIndex();
        if (context == "inventory") {
            $inventory[index].amount++;
            debounce(save);
            return;
        } else if (context == "search") {
            if (index != -1) {
                $inventory[index].amount++;
                debounce(save);
                return;
            }
            item.amount = 1;
            $inventory = [...$inventory, item];
            save();
            return;
        }
    };
    const handleMinus = () => {
        const index = getIndex();
        if (item.amount != 1) {
            $inventory[index].amount--;
            debounce(save);
            return;
        }
        $inventory = $inventory.filter((obj) => {
            return obj.name !== item.name;
        });
        debounce(save);
    };
</script>

<div class="w-auto h-auto border-2 border-black">
    <div
        class="w-full h-auto relative block bg-gradient-to-t from-gray-800 to-gray-500"
        on:mouseover={handleMouseover}
        on:focus={handleMouseover}
        on:mouseleave={handleMouseleave}
    >
        {#if visible}
            <div
                class="absolute block top-0 bottom-0 left-0 right-0 p-1 bg-black/25 text-white backdrop-blur z-10"
                transition:fade={{ duration: 100 }}
            >
                <div class="absolute right-1 bottom-1 flex flex-col">
                    <button class="item-button-small text-black" on:click={handlePlus}
                        >+</button
                    >
                    {#if context == "inventory"}
                        <button class="item-button-small text-black" on:click={handleMinus}
                            >-</button
                        >
                    {/if}
                </div>
                <div class="absolute top-1 w-10/12">
                    <p
                        class={String(item.origin).length >= 25
                            ? "text-[0.5rem]"
                            : "text-xs"}
                    >
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
            {#key item.amount}
                <p
                    class="absolute right-1 top-[0.1rem] font-mono font-bold z-20 text-white"
                    transition:fade={{ duration: 100 }}
                >
                    {item.amount}
                </p>
            {/key}
        {/if}
        <img
            on:error={handleImgError}
            class="w-32 h-auto"
            src={"images/" + image + ".png"}
            alt="knife"
        />
    </div>
    <div
        class={`w-full h-auto px-2 py-[0.05rem] bg-gradient-to-t from-gray-700 ${colorFromRarity(
            item.rarity
        )}`}
    >
        <p
            class={`font-semibold text-center text-white ${
                item.name.length >= 12 ? "text-sm py-[2px]" : "text-md"
            }`}
        >
            {item.name}
        </p>
    </div>
</div>
