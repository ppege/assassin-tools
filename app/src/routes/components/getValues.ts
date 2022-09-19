import type { item } from "./stores";
export const getValues = async (code: string): Promise<item[]> => {
    const names = await (
        await fetch(`https://api.nangurepo.com/v2/assassin?code=${code}`)
    ).json();
    const data = await (
        await fetch(
            `https://api.nangurepo.com/v2/assassin?limit=1&name=${names}`
        )
    ).json();
    return fillAttr(generateStacks(Array.isArray(data) ? data : []));
};
const fillAttr = (arr: item[]) => {
    for (const obj of arr) {
        obj.attr = {
            favorite: false,
            trading: false
        }
    }
    return arr;
}
const generateStacks = (arr: item[]) => {
    const results = [];
    let prevItem: item = arr[0];
    for (const [i, currentItem] of arr.entries()) {
        if (i === 0) {
            continue;
        }
        if (currentItem.name == prevItem.name) {
            if (!isNaN(prevItem.amount)) {
                prevItem.amount += 1;
            } else {
                prevItem.amount = 2;
            }
        } else {
            results.push(prevItem);
            prevItem = currentItem;
        }
        if (i == arr.length - 1) {
            results.push(prevItem);
        }
    }
    for (const obj of arr) {
        if (!obj.amount) {
            obj.amount = 1;
        }
    }
    return results;
};
