import { writable } from 'svelte/store'
import { browser } from '$app/env';

const getString = (item: string, fallback: string): string => {
    try {
        return localStorage.getItem(item) || fallback;
    } catch {
        return fallback;
    }
}
const getJSON = (item: string, fallback: any) => {
    try {
        return JSON.parse(localStorage.getItem(item) || `${fallback}`);
    } catch {
        return fallback;
    }
}
export type item = {
    name: string;
    value: string;
    demand: string;
    rarity: string;
    exoticvalue: number;
    obtain: string;
    origin: string;
    amount: number;
    id: number;
}
const defaultItem: item = {name:"",value:"",demand:"",rarity:"",exoticvalue:0,obtain:"",origin:"",amount:0,id:-1}

export const x = writable(0)
export const y = writable(0)
export const visible = writable(false)
export const activeItem = writable(defaultItem)
export const code = writable(getString("code", ""))
export const inventory = writable([defaultItem])

visible.subscribe(value => {
    console.log(value)
})
code.subscribe(value => {
    if (browser) {
        localStorage.setItem("code", value)
    }
})