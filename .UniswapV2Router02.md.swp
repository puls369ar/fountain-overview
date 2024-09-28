FeeOnTransfer (`IUniswapV2Router02` expands `IUniswapV2Router01` by providing FeeOnTransfer Functionality) - Fee-on-Transfer support refers to a mechanism in some ERC-20 tokens where a portion of the transferred amount is deducted as a fee whenever tokens are sent or swapped. This fee is often redistributed or burned, depending on the token's design, and is implemented to incentivize holding or contribute to the project's development

withPermit - When removing liquidity we should sign on transactions to let the router to access our tokens and send it back to us, this problem isn’t actual when creating the liquidity, because we send the tokens ourselves to router

`_addliquidity` function is wrapped by two liquidity creation functions
* addLiquidity
* addLiquidityETH
Liquidity removal functions also have their variations where they implement withPermit and FeeOnTransfer functionality. The latest is a mandatory to manage fee-demanding tokens while those are being transferred back to the holder (when creating we pay it separately, not from the tokens provided for the liquidity)
WhyETH?
* removeLiquidity
* removeLiquidityETH
* removeLiquidityETHSupportingFeeOnTransferTokens
* removeLiquidityWithPermit
* removeLiquidityETHWithPermit
* removeLiquidityETHWithPermitSupportingFeeOnTransferTokens


To understand nine variations of swap functions inside `UniswapV2Router02` we separate three swappable entities
* exactToken - Token,amount of which we provide
* Token - Token, amount of which is determined the Contract’s by AMM logic
* ETH  - ETH wrapped by it’s ERC20 WETH version that we provide or get after the swap

Now when we make all the possible combinations from this three and add FeeOnTransfer functionality variations too,we get


* exactToken->Token + FeeOnTransfer
* exactToken->Token - We provide exact amount for “investing” token and get calculated amount of “returning” Token
* Token->exactToken - We provide exact amount for “returning” token and get calculated amount of “investing” Token

* ETH->Token  + FeeOnTransfer
* ETH->Token - We provide exact amount for “investing” ETH token and get calculated amount of “returning” Token
* Token->ETH - We provide exact amount for “returning” ETH token and get calculated amount of “investing” Token

* exactToken->ETH  + FeeOnTransfer
* exactToken->ETH - We provide exact amount for “investing” token and get calculated amount of “returning” ETH Token
* ETH->exactToken - We provide exact amount for “returning” token and get calculated amount of “investing” ETH Token

Note that we don’t have separate FeeOnTransfer supporting functions for the ones that provide”returning” token amount. That is because the the “investing” token amount in this case come with the fee already reduced from it. Unlike the functions where we provide “investing” token amount we also need to get
fees separately depended on this amount that we are gonna send. By the way all functions are wrapped around internal `_swap` function, except the ones that are FeeOnTransfer support. Those use `_swapSupportingFeeOnTransferTokens` internal function

Inside these swap functions helper functions are used that are defined in same contract at the lowest section

* quote: This function calculates the equivalent amount of token B for a given amount of token A based on their reserves. It takes three arguments: the amount of token A, the reserve of token A, and the reserve of token B. It returns the calculated amount of token B.
* getAmountOut: This function determines the amount of output tokens that will be received from a swap given a specific input amount. It requires the amount of input tokens, the reserve of the input token, the reserve of the output token, and the address of the pair. It returns the amount of output tokens.
* getAmountIn: This function calculates the amount of input tokens needed to obtain a specified amount of output tokens based on the current reserves. It takes the amount of output tokens, the reserve of the input token, the reserve of the output token, and the pair address as arguments. It returns the required amount of input tokens.
* getAmountsOut: This function returns the amounts of tokens required for a multi-hop swap given an input amount and a path of token addresses. It takes the amount of input tokens and an array of token addresses as parameters. It returns an array of amounts corresponding to each token in the path.
* getAmountsIn: Similar to getAmountsOut, this function provides the amounts of tokens needed for a multi-hop swap to achieve a specified output amount. It takes the output amount and an array of token addresses as input. It returns an array of amounts corresponding to each token in the path.



