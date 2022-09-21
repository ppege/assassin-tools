<script lang="ts">
    interface data {
        username: string;
        message: string;
    }
    export let data: data;
    let time = new Date();
    $: hours = time.getHours();
    $: minutes = time.getMinutes();
</script>

<div class="bg-[#36393f] p-4 rounded text-white max-w-[40ch]">
    <div class="flex flex-row items-center gap-1">
        <p class="font-semibold">
            {data.username.charAt(0).toUpperCase() + data.username.slice(1)}
        </p>
        <p class="text-sm text-gray-400">{hours}:{minutes}</p>
    </div>
    {#if data.message.includes("**Trading**")}
        <p class="whitespace-pre-line"><b>Trading</b> {data.message.slice(11)}</p>
    {:else}
        <p class="whitespace-pre-line">{data.message}</p>
    {/if}
</div>
