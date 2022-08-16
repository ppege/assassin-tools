<script lang="ts">
    $: output = ''
    const getValues = async () => {
		const itemList = await fetch('https://api.nangurepo.com/v2/assassin?code=nangu')
        .then(x => x.json())
        output = await fetch(`https://api.nangurepo.com/v2/assassin?name=${itemList}`)
        .then(x => x.json())
    }
</script>
<body>
    <div class="w-full h-full items-center justify-center">
        <h1 class="text-3xl">🧌</h1>
        <button on:click={getValues} class="bg-black text-white rounded px-2 py-1 text-xl hover:bg-slate-900">Get Values</button>
        <div class="flex flex-wrap">
            {#each output as item}
            <div class="shadow-sm w-auto h-auto px-4 py-4">
                <p class="text-xl font-bold">{item["NAME"]}</p>
                <p class="text-sm">{item["DEMAND"]}</p>
                <p class="text-xl font-bold">{item["VALUE"]}</p>
            </div>
            {/each}
        </div>
    </div>
</body>