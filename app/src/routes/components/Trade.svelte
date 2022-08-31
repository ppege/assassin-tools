<script lang="ts">
    import { inventory } from "./stores"
</script>

<div class="default w-full h-auto rounded p-2">
    <h1 class="text-xl font-bold">Stats</h1>
    <p>
        Total value: {$inventory
            .map((obj) => {
                return typeof obj.exoticvalue == "number" ? obj.exoticvalue : 0;
            })
            .reduce((a, b) => a + b, 0)}
    </p>
</div>
