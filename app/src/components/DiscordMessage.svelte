<script lang="ts">
    interface data {
        username: string;
        message: string;
    }
    export let data: data;
</script>

<div class="bg-[#36393f] p-3 rounded-lg text-white max-w-[40ch]">
    <div class="flex flex-row gap-4">
        <img
            class="rounded-full w-10 h-10"
            src="https://archive.org/download/discordprofilepictures/discordgrey.png"
            alt=""
        />
        <div>
            <div class="flex flex-row items-center gap-1">
                <p class="font-semibold">
                    {data.username.charAt(0).toUpperCase() +
                        data.username.slice(1)}
                </p>
                <p class="text-xs text-gray-400">
                    Today at {new Date()
                        .toLocaleDateString("en-us", {
                            hour: "numeric",
                            minute: "2-digit",
                        })
                        .slice(-8)}
                </p>
            </div>
            {#if data.message.includes("**Trading**")}
                <p class="whitespace-pre-line">
                    <b>Trading</b>
                    {data.message.slice(11)}
                </p>
            {:else}
                <p class="whitespace-pre-line">{data.message}</p>
            {/if}
        </div>
    </div>
</div>
