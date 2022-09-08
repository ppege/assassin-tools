<script lang="ts">
    export let title: string;
    export let value: string|number;
</script>
<div class="bg-white rounded h-auto w-fit px-2 py-1 shadow">
    <p class="text-sm font-medium text-gray-600">{title}</p>
    <p class="font-semibold text-gray-700">{value}</p>
</div>
