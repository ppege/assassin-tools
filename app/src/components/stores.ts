import { writable } from "svelte/store";
import { browser } from "$app/env";

const getString = (item: string, fallback: string): string => {
    try {
        return localStorage.getItem(item) || fallback;
    } catch {
        return fallback;
    }
};
export type item = {
    name: string;
    value: string;
    demand: string;
    rarity: string;
    exoticvalue: number;
    obtain: string;
    origin: string;
    amount: number;
    attr: {
        favorite: boolean;
        trading: boolean;
    };
};
const defaultItem: item = {
    name: "",
    value: "",
    demand: "",
    rarity: "",
    exoticvalue: 0,
    obtain: "",
    origin: "",
    amount: 0,
    attr: {
        favorite: false,
        trading: false,
    },
};

export const code = writable(getString("code", ""));
export const inventory = writable([defaultItem]);
export const warn = writable(getString("warn", "true") == "true");
export const codeDialog = writable(false);

code.subscribe((value) => {
    if (browser) {
        localStorage.setItem("code", value);
    }
});
warn.subscribe((value) => {
    if (browser) {
        localStorage.setItem("warn", value == true ? "true" : "false");
    }
});
