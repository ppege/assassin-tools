<script lang="ts">
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import HelperText from "@smui/textfield/helper-text";
    import CharacterCounter from "@smui/textfield/character-counter";
    import type { MenuComponentDev } from "@smui/menu";
    import Menu from "@smui/menu";
    import { Anchor } from "@smui/menu-surface";
    import List, { Item, Text, PrimaryText, SecondaryText } from "@smui/list";
    let menu: MenuComponentDev;
    let anchor: HTMLDivElement;
    let anchorClasses: { [k: string]: boolean } = {};
    import {
        inventory,
        code,
        codeDialog,
        password,
        passwordCorrect,
    } from "./stores";
    import { getValues } from "./getValues";
    import { save } from "./save";
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Snackbar, {
        Actions as SnackbarActions,
        Label as SnackbarLabel,
    } from "@smui/snackbar";
    import IconButton from "@smui/icon-button";
    import DiscordMessage from "./DiscordMessage.svelte";
    import Checkbox from "@smui/checkbox";
    import axios from "axios";
    let snackbarWithClose: SnackbarComponentDev;
    let adDialog = false;
    let settingsDialog = false;
    let value = "";
    let timer: any;
    const debounce = () => {
        $inventory.items = [];
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await getValues();
        }, 250);
    };
    debounce();
    $: generateTradeAd = () => {
        const obj = $inventory.items
            .filter((obj) => obj.attr.trading)
            .map((obj) =>
                obj.amount > 1
                    ? obj.amount +
                      " " +
                      obj.name +
                      (obj.amount > 1
                          ? obj.name.slice(-1) == "s"
                              ? ""
                              : "s"
                          : "")
                    : obj.name
            );
        if ((obj.length > 2 && obj.length < 5) || obj.length > 7) {
            return "**Trading** " + obj.join(", ");
        }
        if (obj.length > 4 && obj.length < 8) {
            return "**Trading**\n " + obj.join("\n");
        }
        return "**Trading** " + obj.join(" and ");
    };
    $: ad = generateTradeAd();
    const copyAd = () => {
        navigator.clipboard.writeText(ad);
        snackbarWithClose.open();
    };
    const verifyCredentials = () => {
        axios
            .post("https://api.nangu.dev/v2/assassin/verify", {
                code: $code,
                password: $password,
            })
            .then(() => {
                $passwordCorrect = true;
            })
            .catch(() => {
                $passwordCorrect = false;
            });
    };
    verifyCredentials();
</script>

<Snackbar bind:this={snackbarWithClose}>
    <SnackbarLabel>Ad copied!</SnackbarLabel>
    <SnackbarActions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </SnackbarActions>
</Snackbar>
<Dialog
    bind:open={settingsDialog}
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
>
    <Title id="simple-title">Settings</Title>
    <Content>
        <div class="flex flex-row items-center">
            <Checkbox bind:checked={$inventory.meta.private} />
            <p class="text-sm text-gray-400">Private</p>
        </div>
    </Content>
    <Actions>
        <Button>
            <Label>Cancel</Label>
        </Button>
        <Button on:click={save}>
            <Label>Save</Label>
        </Button>
    </Actions>
</Dialog>
<Dialog
    bind:open={$codeDialog}
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
>
    <Title>Set inventory code</Title>
    <Content>
        <Textfield
            type="text"
            bind:value={$code}
            on:keyup={debounce}
            label="Inventory code"
            input$maxlength={32}
        >
            <svelte:fragment slot="helper">
                <HelperText>Type anything if you are new</HelperText>
                <CharacterCounter>0 / 32</CharacterCounter>
            </svelte:fragment>
        </Textfield>
        <Textfield
            type="password"
            bind:value={$password}
            on:keyup={debounce}
            label="Inventory password"
            input$maxlength={32}
            input$minlength={4}
        >
            <svelte:fragment slot="helper">
                <HelperText>Type anything if you are new</HelperText>
                <CharacterCounter>0 / 32</CharacterCounter>
            </svelte:fragment>
        </Textfield>
    </Content>
    <Actions>
        <Button on:click={verifyCredentials}>
            <Label>Done</Label>
        </Button>
    </Actions>
</Dialog>
<Dialog
    bind:open={adDialog}
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
>
    <Title>Generate trade ad</Title>
    <Content>
        {#if ad == "**Trading** "}
            Nothing selected. To select an item, press the <button
                class="item-button-small text-black hover:bg-green-100 active:bg-green-50"
                >♻️</button
            > button on the items you'd like to advertise.
        {:else}
            <DiscordMessage data={{ username: $code, message: ad }} />
        {/if}
        {#if $inventory.items.filter((obj) => obj.attr.trading).length > 7}
            <p class="text-xs mt-1">
                Newlines not available due to too many items; the limit is 7
            </p>
        {/if}
    </Content>
    {#if ad != "**Trading** "}
        <Actions>
            <Checkbox
                on:click={() => {
                    if (ad.includes(" - PM me!")) {
                        ad = ad.replace(" - PM me!", "");
                    } else {
                        ad = ad + " - PM me!";
                    }
                }}
            />
            <p class="text-sm text-gray-400">Add "PM me!"</p>
            <Checkbox
                checked
                on:click={() => {
                    if (ad.includes("**")) {
                        ad = ad.replace("**Trading**", "Trading");
                    } else {
                        ad = ad.replace("Trading", "**Trading**");
                    }
                }}
            />
            <p class="text-sm text-gray-400">Bold "Trading"</p>
            <Checkbox
                disabled={$inventory.items.filter((obj) => obj.attr.trading)
                    .length > 7}
                checked={ad.includes("\n")}
                on:click={() => {
                    if (ad.includes("\n")) {
                        if (ad.includes("**")) {
                            ad = ad.replace("**Trading**\n", "**Trading**");
                        } else {
                            ad = ad.replace("Trading\n", "Trading");
                        }
                        ad = ad.replace(/\n/g, ", ");
                    } else {
                        if (ad.includes("**")) {
                            ad = ad.replace("**Trading**", "**Trading**\n");
                        } else {
                            ad = ad.replace("Trading", "Trading\n");
                        }
                        ad = ad.replace(/, /g, "\n");
                    }
                }}
            />
            <p class="text-sm text-gray-400">Use newlines</p>
        </Actions>
    {/if}
    <Actions>
        {#if ad != "**Trading** "}
            <Button on:click={copyAd}>
                <Label>Copy</Label>
            </Button>
        {/if}
        <Button>
            <Label>OK</Label>
        </Button>
    </Actions>
</Dialog>
<div
    class={Object.keys(anchorClasses).join(" ")}
    use:Anchor={{
        addClass: (className) => {
            if (!anchorClasses[className]) {
                anchorClasses[className] = true;
            }
        },
        removeClass: (className) => {
            if (anchorClasses[className]) {
                delete anchorClasses[className];
                anchorClasses = anchorClasses;
            }
        },
    }}
    bind:this={anchor}
>
    <Button on:click={() => menu.setOpen(true)}>
        <Label>Actions</Label>
    </Button>
    <Menu
        bind:this={menu}
        anchor={false}
        bind:anchorElement={anchor}
        anchorCorner="BOTTOM_LEFT"
    >
        <List twoLine>
            <Item on:SMUI:action={() => ($codeDialog = true)}>
                <Text>
                    <PrimaryText>Set code</PrimaryText>
                    <SecondaryText>Set the inventory code</SecondaryText>
                </Text>
            </Item>
            <Item
                on:SMUI:action={() => (settingsDialog = true)}
                disabled={$inventory.meta.private && !$passwordCorrect}
            >
                <Text>
                    <PrimaryText>Settings</PrimaryText>
                    <SecondaryText>Change your settings</SecondaryText>
                </Text>
            </Item>
            <Item
                on:SMUI:action={() => (adDialog = true)}
                disabled={$inventory.meta.private && !$passwordCorrect}
            >
                <Text>
                    <PrimaryText>Trade ad</PrimaryText>
                    <SecondaryText
                        >Generate a trade ad for use in the Assassin! discord</SecondaryText
                    >
                </Text>
            </Item>
        </List>
    </Menu>
</div>
