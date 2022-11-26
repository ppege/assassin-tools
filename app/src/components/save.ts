import { getValues } from "./getValues";
import { inventory, code, password, passwordCorrect } from "./stores";
import { get } from "svelte/store";
import axios from "axios";
export const save = async () => {
    const inv = get(inventory);
    const data = inv.items.map((obj) => {
        return {
            name: obj.name,
            amount: obj.amount,
            trading: obj.attr.trading,
            favorite: obj.attr.favorite,
        };
    });
    axios
        .post("https://api.nangu.dev/v2/assassin", {
            code: get(code),
            data: {
                password: get(password),
                meta: { private: get(inventory).meta.private },
                items: data,
            },
        })
        .then(async () => {
            if (inv.items.length > 1) {
                await getValues();
            }
        })
        .catch(async (err) => {
            if (err.response) {
                if (err.response.status === 401) {
                    passwordCorrect.set(false);
                    if (inv.items.length > 1) {
                        await getValues();
                    }
                }
            }
        });
};
