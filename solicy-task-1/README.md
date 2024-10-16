In this folder are all the theoretical resources related to the 1st Solicy task, which is
* Learn about **lif3** ecosystem, **Fantom** chain etc (check *theory.md*)
* Learn **Fountain** contract (check *Fountain.md*)
* Learn **ModernTreasury** contract (check *ModernTreasury.md* [yet to come])


# Questions&Notes
* The `ModernTreasury` contract is responsible for distributing rewards based on the price ratios of certain token pairs and the `Fountain` contract is where these rewards are eventually distributed to participants, likely stakers or liquidity providers
* *Moderntreasury.sol* is a single contract `ModernTreasury` file, good. But in *ModernMasonry* there are plenty of contracts that could be deployed separately and then imported like others are done at the same place. I guess that's also the reason why the contract itself
isn't called `ModernMasonry`, but `Fountain`
* Nor `ModernTreasury` implements `IModernTreasury` from **ModernMasonry** neither `Fountain` implements `IModernMasonry` from **ModernTreasury**․ how these instances are created in that case?
*  
