<script lang="ts">
    import type { item } from "./stores";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import HelperText from "@smui/textfield/helper-text";
    import Autocomplete from "@smui-extra/autocomplete";

    import Paper, {
        Title as PaperTitle,
        Content as PaperContent,
    } from "@smui/paper";
    import type { MenuComponentDev } from "@smui/menu";
    import Menu from "@smui/menu";
    import { Anchor } from "@smui/menu-surface";
    import List, {
        Item,
        Separator,
        Text,
        PrimaryText,
        SecondaryText,
    } from "@smui/list";
    let menu: MenuComponentDev;
    let anchor: HTMLDivElement;
    let anchorClasses: { [k: string]: boolean } = {};
    import { inventory, code, codeDialog } from "./stores";
    import { getValues } from "./getValues";
    let requestDialog = false;
    let adDialog = false;
    let focused = false;
    let focused2 = false;
    let focused3 = false;
    let value = "";
    let timer: any;
    let chosenItem: string | undefined = undefined;
    const debounce = () => {
        $inventory = [];
        clearTimeout(timer);
        timer = setTimeout(async () => {
            $inventory = await getValues($code);
        }, 250);
    };
    debounce();
    $: generateTradeAd = () => {
        const obj = $inventory
            .filter((obj) => obj.attr.trading)
            .map(
                (obj) =>
                    obj.amount + " " + obj.name + (obj.amount > 1 ? "s" : "")
            );
        return obj.join(", ");
    };
    $: ad = generateTradeAd();
</script>

<Dialog
    bind:open={requestDialog}
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
>
    <Title id="simple-title">Send trade request</Title>
    <Content>
        <Textfield
            type="text"
            bind:value
            label="To"
            on:focus={() => (focused = true)}
            on:blur={() => (focused = false)}
        >
            <HelperText slot="helper">
                Type the inventory code of the receiver
            </HelperText>
        </Textfield>
    </Content>
    <Actions>
        <Button>
            <Label>Cancel</Label>
        </Button>
        <Button>
            <Label>Next</Label>
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
            on:focus={() => (focused2 = true)}
            on:blur={() => (focused2 = false)}
        />
    </Content>
    <Actions>
        <Button>
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
        <Textfield
            textarea
            value={ad}
            label="Your trade ad"
            on:focus={() => (focused3 = true)}
            on:blur={() => (focused3 = false)}
        />
    </Content>
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
    <Button variant="outlined" on:click={() => menu.setOpen(true)}>
        <Label>View Actions</Label>
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
            <Item on:SMUI:action={() => (requestDialog = true)}>
                <Text>
                    <PrimaryText>Trade request</PrimaryText>
                    <SecondaryText>Send a trade request</SecondaryText>
                </Text>
            </Item>
            <Item on:SMUI:action={() => (adDialog = true)}>
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
