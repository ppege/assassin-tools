<script lang="ts">
    import { getValues } from "./getValues";
    import { fade } from "svelte/transition";
    import {
        inventory,
        trade,
        code,
        warn,
        password,
        passwordCorrect,
    } from "./stores";
    import type { item, tradeContainer } from "./stores";
    import { save } from "./save";
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Card from "@smui/card";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Checkbox from "@smui/checkbox";
    import axios from "axios";

    export let context: string;
    export let side: string = "";
    export let item: item;
    let visible = false;
    let open = false;
    let addedStyles: string;
    export let snackbarWithClose: SnackbarComponentDev | undefined;

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
    const debounce = async () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await save();
            announceSaved();
        }, 1500);
    };
    const announceSaved = () => {
        snackbarWithClose?.open();
        setTimeout(() => {
            snackbarWithClose?.close();
        }, 3000);
    };
    const handlePlus = () => {
        const index = getIndex();
        if (context == "inventory") {
            $inventory[index].amount++;
            debounce();
            return;
        }
        if (context == "search") {
            if (index != -1) {
                $inventory[index].amount++;
                debounce();
                return;
            }
            item.amount = 1;
            $inventory = [...$inventory, item];
            save();
            return;
        }
        if (context == "trade") {
            item.amount++;
            $trade = $trade;
        }
    };
    const handleMinus = () => {
        if (context == "inventory") {
            const index = getIndex();
            if (item.amount != 1) {
                $inventory[index].amount--;
                debounce();
                return;
            } else {
                if (item.attr.favorite) {
                    if (!confirm("Delete favorited item?")) {
                        return;
                    }
                }
            }
            $inventory = $inventory.filter((obj) => {
                return obj.name !== item.name;
            });
            debounce();
        }
        if (context == "trade") {
            if (item.amount != 1) {
                item.amount--;
            } else {
                $trade[side as keyof tradeContainer] = $trade[
                    side as keyof tradeContainer
                ].filter((obj) => obj.name != item.name);
            }
            $trade = $trade;
        }
    };
    const handleNuke = (_: any, confirmed: boolean = false) => {
        if ($warn) {
            if (!confirmed) {
                open = true;
                return;
            }
        }
        if (context == "inventory") {
            $inventory = $inventory.filter((obj) => {
                return obj.name !== item.name;
            });
            debounce();
            return;
        }
        if (context == "trade") {
            $trade[side as keyof tradeContainer] = $trade[
                side as keyof tradeContainer
            ].filter((obj) => {
                return obj.name !== item.name;
            });
            return;
        }
    };
    const toggle = (attribute: string) => {
        const index = getIndex();
        if (attribute == "favorite") {
            $inventory[index].attr.favorite = !$inventory[index].attr.favorite;
        } else {
            $inventory[index].attr.trading = !$inventory[index].attr.trading;
        }
        debounce();
    };
    const handleAddTrade = (side: string) => {
        if (
            $trade[side as keyof tradeContainer]
                .map((obj) => obj.name)
                .includes(item.name)
        ) {
            const index = $trade[side as keyof tradeContainer].findIndex(
                (obj) => obj.name == item.name
            );
            $trade[side as keyof tradeContainer][index].amount++;
            return;
        }
        if ($trade[side as keyof tradeContainer].length < 5) {
            let modifiedItem = { ...item };
            modifiedItem.amount = 1;
            $trade[side as keyof tradeContainer] = [
                ...$trade[side as keyof tradeContainer],
                modifiedItem,
            ];
            return;
        }
        addedStyles = "bg-red-300";
        setTimeout(() => {
            addedStyles = "";
        }, 3000);
    };
    const handleAmountClick = () => {
        const input = prompt("New value", String(item.amount));
        if (input === null) {
            return;
        }
        if (isNaN(Number(input))) {
            alert("Value must be an integer");
            return;
        }
        if (Number(input) < 0) {
            alert("Value must be positive");
            return;
        }
        const difference = Number(input) - item.amount;
        if (difference > 9999 || difference < -9999) {
            if (
                !confirm(
                    `This may lag as a function will be called ${difference
                        .toString()
                        .replace("-", "")} times.`
                )
            ) {
                return;
            }
        }
        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                handlePlus();
            }
            return;
        }
        if (difference < 0) {
            for (let i = 0; i > difference; i--) {
                handleMinus();
            }
            return;
        }
        return;
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
                    {#if context == "inventory" || context == "trade"}
                        {#if item.amount > 1}
                            <button
                                class="item-button-small text-black"
                                on:click={handleNuke}
                                disabled={context == "trade"
                                    ? false
                                    : !$passwordCorrect}>💣</button
                            >
                        {/if}
                        <button
                            class="item-button-small text-black"
                            on:click={handleMinus}
                            disabled={context == "trade"
                                ? false
                                : !$passwordCorrect}>-</button
                        >
                    {/if}
                    {#if context == "search"}
                        <button
                            class="item-button-small"
                            on:click={() => handleAddTrade("top")}
                        >
                            +↑
                        </button>
                        <button
                            class="item-button-small"
                            on:click={() => handleAddTrade("bottom")}
                        >
                            +↓
                        </button>
                    {/if}
                    <button
                        class="item-button-small text-black"
                        on:click={handlePlus}
                        disabled={context == "trade"
                            ? false
                            : !$passwordCorrect}>+</button
                    >
                </div>
                <div class="absolute top-1 flex flex-row gap-[1px] w-10/12">
                    {#if context == "inventory"}
                        <button
                            on:click={() => toggle("favorite")}
                            class="item-button-small favorite-toggle {item.attr
                                .favorite
                                ? 'favorite-active'
                                : null}"
                            disabled={!$passwordCorrect}
                        >
                            ⭐️
                        </button>
                        <button
                            on:click={() => toggle("trading")}
                            class="item-button-small trading-toggle {item.attr
                                .trading
                                ? 'trading-active'
                                : null}"
                            disabled={!$passwordCorrect}
                        >
                            ♻️
                        </button>
                        <button
                            class="item-button-small"
                            on:click={() => handleAddTrade("top")}
                        >
                            +↑
                        </button>
                        <button
                            class="item-button-small"
                            on:click={() => handleAddTrade("bottom")}
                        >
                            +↓
                        </button>
                    {:else}
                        <div class="flex flex-col">
                            <p class="{item.obtain.length > 12 ? "text-[0.3rem]":"text-[0.6rem]"} font-semibold">
                                {item.obtain}
                            </p>
                            {#if context == "search"}
                                <p class="text-[0.4rem]">{item.origin}</p>
                            {/if}
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
                        <p class={isNaN(Number(item.value)) ? "text-sm" : ""}>
                            {#if isNaN(Number(item.value))}
                                {item.value}
                            {/if}
                            {#if isNaN(Number(item.value)) && item.exoticvalue !== "Unknown"}
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
        {#if context == "inventory" || context == "trade"}
            {#key item.amount}
                <div
                    class="absolute flex flex-col right-1 top-[0.1rem] font-mono font-bold z-[5] text-right"
                >
                    {#if item.amount > 1 || visible}
                        <p
                            class="dark:text-zinc-300"
                            transition:fade={{ duration: 100 }}
                            on:click={handleAmountClick}
                        >
                            {item.amount}
                        </p>
                    {/if}
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
            class="w-full h-auto transition-colors {addedStyles}"
            src="images/{image}.png"
            alt="knife"
        />
    </div>
    <div
        class={`w-full h-auto px-2 py-[0.05rem] ${colorFromRarity(
            item.rarity
        )}`}
    >
        <p
            class="font-semibold text-center max-h-6 {item.name.length >= 12
                ? item.name.length >= 18
                    ? 'text-[0.5rem] py-[6px]'
                    : 'text-xs py-[4px]'
                : 'text-md'} {item.rarity == 'Dream' ? 'text-black' : 'text-white'}"
        >
            {item.name}
        </p>
    </div>
</Card>
