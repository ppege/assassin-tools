import type { item } from "./stores";
import { get } from "svelte/store";
import { password, inventory, code } from "./stores";
interface storedItem {
    amount: number;
    name: string;
    favorite: boolean;
    trading: boolean;
}
export const getValues = async () => {
    if (!get(code)) {
        return [];
    }
    const inv = await (
        await fetch(
            `https://api.nangu.dev/v2/assassin?code=${get(code)}&password=${get(
                password
            )}`
        )
    ).json();
    const data = await (
        await fetch(
            `https://api.nangu.dev/v2/assassin?limit=1&name=${inv.items.map(
                (obj: storedItem) => obj.name
            )}`
        )
    ).json();
    inventory.set({
        items: await fillAttributes(data, inv.items),
        meta: { private: inv.meta.private },
    });
};
const fillAttributes = async (
    items: item[],
    names: storedItem[]
): Promise<item[]> => {
    for (const obj of items) {
        const matchingName: storedItem = names.filter(
            (name) => name.name == obj.name
        )[0];
        obj.amount = matchingName.amount;
        obj.attr = {
            favorite: matchingName.favorite,
            trading: matchingName.trading,
        };
    }
    return items;
};
