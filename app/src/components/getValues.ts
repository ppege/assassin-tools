import type { item } from "./stores";
interface storedItem {
    amount: number;
    name: string;
    favorite: boolean;
    trading: boolean;
}
export const getValues = async (code: string): Promise<item[]> => {
    const names = await (
        await fetch(`https://api.nangurepo.com/v2/assassin?code=${code}`)
    ).json();
    const data = await (
        await fetch(
            `https://api.nangurepo.com/v2/assassin?limit=1&name=${names.map(
                (obj: storedItem) => obj.name
            )}`
        )
    ).json();
    return await fillAttributes(Array.isArray(data) ? data : [], names);
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
