<script lang="ts">
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import HelperText from "@smui/textfield/helper-text";
    let tradeRequestDialogStep1 = false;
    let tradeRequestDialogStep2 = false;
    let focused = false;
    let value = "";
    const tradeRequest = () => {
        tradeRequestDialogStep1 = true;
    };
</script>

<Dialog
    bind:tradeRequestDialogStep1
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
        <Button on:click={()=>{
            tradeRequestDialogStep1 = false;
            tradeRequestDialogStep2 = true;
        }}>
            <Label>Next</Label>
        </Button>
    </Actions>
</Dialog>
<div class="default relative w-full h-full rounded p-2">
    <h1 class="font-bold text-xl">Actions</h1>
    <div class="flex flex-col w-full gap-1">
        <button class="action-button" on:click={tradeRequest}
            >Trade request</button
        >
        <button class="action-button">bar</button>
        <button class="action-button">foo</button>
        <button class="action-button">bar</button>
    </div>
</div>
