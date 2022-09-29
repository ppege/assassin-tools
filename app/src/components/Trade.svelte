<script lang="ts">
    import type { item } from "./stores";
    import { inventory } from "./stores";
    import Item from "./Item.svelte";
    import Paper, { Content, Title } from "@smui/paper";
    import Ripple from "@smui/ripple";
    import Autocomplete from "@smui-extra/autocomplete";
    import { Text } from "@smui/list";
    import CircularProgress from "@smui/circular-progress";
    import { debounce } from "lodash";

    let value: string;
    const searchAPI = async (input: string) => {
        const response = await fetch("https://api.nangurepo.com/v2/assassin?limit=50&name=" + input)
        const data = await response.json()
        return await data.map((obj: item) => obj.name);
    };
    const debouncedSearch = debounce(searchAPI, 500);
    let items: item[] = [];
</script>

<Paper padded>
    <Title class="text-xl font-bold">Trading</Title>
    <Content>
        <div class="flex flex-col gap-2">
            <Autocomplete
                search={searchAPI}
                bind:value
                showMenuWithNoInput={false}
                label="Add item"
            >
                <Text
                    slot="loading"
                    style="display: flex; width: 100%; justify-content: center; align-items: center;"
                >
                    <CircularProgress
                        style="height: 24px; width: 24px;"
                        indeterminate
                    />
                </Text>
            </Autocomplete>
            <div class="trade-section">
                {#each items as item}
                    <div
                        class="h-full w-full rounded bg-black text-white font-thin text-center justify-center select-none hover:text-black hover:shadow-lg hover:bg-white hover:outline transition-all"
                        use:Ripple={{ surface: true }}
                    >
                        <p class="h-full align-middle">{item.name}</p>
                    </div>
                {/each}
            </div>
        </div>
    </Content>
</Paper>
