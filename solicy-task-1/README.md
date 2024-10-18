In this folder are all the theoretical resources related to the 1st Solicy task, which is
* Learn about **lif3** ecosystem, **Fantom** chain etc (check *theory.md*)
* Learn **Fountain** contract (check *Fountain.md*)
* Learn **ModernTreasury** contract (check *ModernTreasury.md* [yet to come])


# Questions&Notes
* The `ModernTreasury` contract is responsible for distributing rewards based on the price ratios of certain token pairs and the `Fountain` contract is where these rewards are eventually distributed to participants, likely stakers or liquidity providers
* *Moderntreasury.sol* is a single contract `ModernTreasury` file, good. But in *ModernMasonry* there are plenty of contracts that could be deployed separately and then imported like others are done at the same place. I guess that's also the reason why the contract itself
isn't called `ModernMasonry`, but `Fountain`
* Nor `ModernTreasury` implements `IModernTreasury` from **ModernMasonry** neither `Fountain` implements `IModernMasonry` from **ModernTreasury**․ how these instances are created in that case?
* I see in our contracts we use **solidity 0.8.9** that are supported laslty by `@openzeppelin/contracts@4.9.3` versions while contracts we import (Accesontrol, Reentrancyguard, etc.) have versions **solidity 0.8.20** as they are imported through `@openzeppelin/contracts@v5.0.2` some names are changed too and some incompatibilities exist. Also in `Oracle` we use *UniswapV2Library->FixedPoint->BitMath* which has a lot of expressions like `uint144(-1)` that is forbidden starting from **solidity 8.0.0** I rather use the original latest versions from **openzeppelin** and update our code so it works with them, then duplicate old versions locally or install older version of **openzeppelin**
  * `safeTransfer()` from `SafeERC20.sol` is now replaced to `forceTranfer()`
  *
* `Operator.sol` was introduced in both **ModernMasonry** and **ModernTreasury**, but wasn't used so I just deleted it for now
* `@openzeppelin/contracts@5.0.2` no longer has **SafeMath**, strange. I'll import it from `@uniswap/v2-periphery` instead
