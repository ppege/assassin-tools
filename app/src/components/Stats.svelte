<script lang="ts">
    import { inventory } from "./stores";
    import StatCard from "./StatCard.svelte";
    import Paper, { Title, Content } from "@smui/paper";
    interface tradability {
        text: string;
        score: number;
        color: string;
    }
    const getDemandNumber = (demand: string): number => {
        let arr: number[] = [];
        demand.split("").forEach((char) => {
            arr.push(char == "\u2605" ? 1 : 0);
        });
        return arr.reduce((a, b) => a + b);
    };
    $: averageDemand = $inventory.length
        ? (
              $inventory
                  .map((obj) => {
                      return getDemandNumber(obj.demand) * obj.amount;
                  })
                  .reduce((a, b) => a + b) /
              $inventory.map((obj) => obj.amount).reduce((a, b) => a + b)
          ).toFixed(3)
        : 0;
    $: valueDensity = $inventory.length
        ? (
              $inventory
                  .map((obj) => {
                      return typeof obj.exoticvalue == "number"
                          ? obj.exoticvalue * obj.amount
                          : 0;
                  })
                  .reduce((a, b) => a + b, 0) /
              $inventory.map((obj) => obj.amount).reduce((a, b) => a + b)
          ).toFixed(3)
        : 0;
    $: getTradability = (): tradability => {
        const demandScore = (averageDemand / 4) * 100;
        const densityScore = (valueDensity / 20) * 100;
        const totalScore =
            ((demandScore > 100 ? 100 : demandScore) +
                (densityScore > 100 ? 100 : densityScore)) /
            2;
        const totalScoreRounded = totalScore > 100 ? 100 : totalScore;
        return {
            score: totalScoreRounded,
            text: getTradabilityText(totalScoreRounded).text,
            color: getTradabilityText(totalScoreRounded).color,
        };
    };
    const getTradabilityText = (
        score: number
    ): { text: string; color: string } => {
        switch (Math.ceil(score / 10) * 10) {
            case 10:
                return { text: "Terrible", color: "bg-red-400" };
            case 20:
                return { text: "NOT GOOD/10", color: "bg-red-300" };
            case 30:
                return { text: "Mid", color: "bg-yellow-200" };
            case 40:
                return { text: "Alright", color: "bg-green-200" };
            case 50:
                return { text: "Good", color: "bg-green-500" };
            case 60:
                return { text: "Very good", color: "bg-green-400" };
            case 70:
                return { text: "Great", color: "bg-blue-400" };
            case 80:
                return { text: "Incredible👏", color: "bg-blue-300" };
            case 90:
                return { text: "Fantastic🤩", color: "bg-blue-200" };
            case 100:
                return { text: "Perfect🎉", color: "bg-purple-300" };
            default:
                return { text: "Unknown", color: "" };
        }
    };
</script>

<Paper>
    <Title>Stats</Title>
    <Content class="flex flex-wrap gap-2 max-h-fit mt-4">
        <StatCard
            title="Total value"
            value={$inventory
                .map((obj) => {
                    return typeof obj.exoticvalue == "number"
                        ? obj.exoticvalue * obj.amount
                        : 0;
                })
                .reduce((a, b) => a + b, 0) + " exotics"}
        />
        <StatCard
            title="Average value"
            value={valueDensity}
        />
        <StatCard title="Average demand" value={averageDemand} />
        <StatCard
            title="Average demand"
            tag={{
                text: "exotic+",
                description:
                    "Only counts demand of exotics, mythics and dreams",
            }}
            value={$inventory.length
                ? (
                      $inventory
                          .map((obj) => {
                              return obj.rarity == "Exotic" ||
                                  obj.rarity == "Mythic" ||
                                  obj.rarity == "Dream"
                                  ? getDemandNumber(obj.demand) * obj.amount
                                  : 0;
                          })
                          .reduce((a, b) => a + b) /
                      $inventory
                          .map((obj) =>
                              obj.rarity == "Exotic" ||
                              obj.rarity == "Mythic" ||
                              obj.rarity == "Dream"
                                  ? obj.amount
                                  : 0
                          )
                          .reduce((a, b) => a + b)
                  ).toFixed(3)
                : 0}
        />
        <StatCard
            title="Item count"
            value={$inventory
                .map((obj) => {
                    return typeof obj.amount == "number" ? obj.amount : 1;
                })
                .reduce((a, b) => a + b, 0)}
        />
        <StatCard
            title="Item count"
            tag={{
                text: "unique",
                description: "Unique items in your inventory - no stacks",
            }}
            value={$inventory.length}
        />
        <StatCard
            title="Tradability"
            tag={{
                text: getTradability().text,
                description:
                    "Tradability is a shot in the dark at pinpointing how tradable your inventory is, and how easy it is to get good trades with. This takes into account the average demand and value of your inventory.",
            }}
            value={getTradability().score.toFixed(3) + "%"}
            styling={getTradability().color}
        />
    </Content>
</Paper>
