<script lang="ts">
    import { getValues } from "./getValues";
    import { fade } from "svelte/transition";
    import { inventory, code, warn } from "./stores";
    import type { item } from "./stores";
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Card from "@smui/card";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Checkbox from "@smui/checkbox";
    export let context: string;
    export let item: item;
    let visible = false;
    let open = false;
    export let snackbarWithClose: SnackbarComponentDev;

    $: image = item.name.toUpperCase().replace(/ /g, "_");
    const colorFromRarity = (rarity: String) => {
        switch (rarity) {
            case "Common":
                return "bg-green-300";
            case "Rare":
                return "bg-blue-400";
            case "Legendary":
                return "bg-purple-600";
            case "Exotic":
                return "bg-orange-500";
            case "Mythic":
                return "bg-red-500";
            case "Dream":
                return "bg-blue-200";
            default:
                return "bg-black";
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
        }, 1500);
    };
    const announceSaved = () => {
        snackbarWithClose.open();
        setTimeout(() => {
            snackbarWithClose.close();
        }, 3000);
    };
    const save = async () => {
        const data = $inventory.map((obj) => {
            return {
                name: obj.name,
                amount: obj.amount,
                trading: obj.attr.trading,
                favorite: obj.attr.favorite,
            };
        });
        fetch(
            `https://api.nangurepo.com/v2/assassin?code=${$code}&data=${JSON.stringify(
                data
            )}`
        ).then(async () => {
            if ($inventory.length > 1) {
                $inventory = await getValues($code);
            }
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
    const handleNuke = (_: any, confirmed: boolean = false) => {
        console.log($warn);
        if ($warn) {
            if (!confirmed) {
                open = true;
                return;
            }
        }
        $inventory = $inventory.filter((obj) => {
            return obj.name !== item.name;
        });
        debounce(save);
    };
    const toggle = (attribute: string) => {
        const index = getIndex();
        if (attribute == "favorite") {
            $inventory[index].attr.favorite = !$inventory[index].attr.favorite;
        } else {
            $inventory[index].attr.trading = !$inventory[index].attr.trading;
        }
        debounce(save);
    };
</script>

<Card>
    <Dialog
        bind:open
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
    >
        <Title id="simple-title">You sure?</Title>
        <Content id="simple-content">This will nuke the whole stack.</Content>
        <Actions>
            <Checkbox on:click={() => ($warn = !$warn)} />
            <p class="text-sm text-gray-400">Don't remind me again</p>
            <Button>
                <Label>No</Label>
            </Button>
            <Button on:click={() => handleNuke(null, true)}>
                <Label>Yes</Label>
            </Button>
        </Actions>
    </Dialog>
    <div
        class="w-full h-auto relative block dark:bg-zinc-900"
        on:mouseover={handleMouseover}
        on:focus={handleMouseover}
        on:mouseleave={handleMouseleave}
    >
        {#if visible}
            <div
                class="absolute block top-0 bottom-0 left-0 right-0 p-1 bg-white/50 dark:bg-black/25 backdrop-blur z-[5]"
                transition:fade={{ duration: 100 }}
            >
                <div
                    class="absolute z-10 right-1 bottom-1 h-auto flex flex-col gap-[1px]"
                >
                    {#if context == "inventory"}
                        {#if item.amount > 1}
                            <button
                                class="item-button-small text-black"
                                on:click={handleNuke}>💣</button
                            >
                        {/if}
                        <button
                            class="item-button-small text-black"
                            on:click={handleMinus}>-</button
                        >
                    {/if}
                    <button
                        class="item-button-small text-black"
                        on:click={handlePlus}>+</button
                    >
                </div>
                <div class="absolute top-1 flex flex-row gap-[1px] w-10/12">
                    {#if context == "inventory"}
                        <button
                            on:click={() => toggle("favorite")}
                            class="item-button-small text-black hover:bg-yellow-100 active:bg-yellow-50 {item
                                .attr.favorite
                                ? 'bg-yellow-200'
                                : null}"
                        >
                            ⭐️
                        </button>
                        <button
                            on:click={() => toggle("trading")}
                            class="item-button-small text-black hover:bg-green-100 active:bg-green-50 {item
                                .attr.trading
                                ? 'bg-green-200'
                                : null}"
                        >
                            ♻️
                        </button>
                    {:else}
                        <div class="flex flex-col">
                            <p class="text-[0.4rem] font-semibold">
                                {item.obtain}
                            </p>
                            <p class="text-[0.4rem]">{item.origin}</p>
                        </div>
                    {/if}
                </div>
                <div class="absolute bottom-1">
                    {#if context == "inventory"}
                        <p class="text-[0.4rem]">
                            {item.obtain}
                        </p>
                    {/if}
                    <p class="text-xs">{item.rarity}</p>
                    <div class="font-bold text-sm">
                        <p class={isNaN(item.value) ? "text-sm" : ""}>
                            {#if isNaN(item.value)}
                                {item.value}
                            {/if}
                            {#if isNaN(item.value) && item.exoticvalue !== "Unknown"}
                                /
                            {/if}
                            {#if item.exoticvalue !== "Unknown"}
                                {item.exoticvalue} exotics
                            {/if}
                        </p>
                    </div>
                    <p>{item.demand}</p>
                </div>
            </div>
        {/if}
        {#if item.amount > 1 && context == "inventory"}
            {#key item.amount}
                <div
                    class="absolute flex flex-col right-1 top-[0.1rem] font-mono font-bold z-[5] text-right"
                >
                    <p transition:fade={{ duration: 100 }}>
                        {item.amount}
                    </p>
                    {#if visible}
                        <p
                            class="font-normal text-yellow-500 dark:text-yellow-300 -mt-1"
                            transition:fade={{ duration: 100 }}
                        >
                            {item.exoticvalue * item.amount}
                        </p>
                    {/if}
                </div>
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
        class={`w-full h-auto px-2 py-[0.05rem] ${colorFromRarity(
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
</Card>
