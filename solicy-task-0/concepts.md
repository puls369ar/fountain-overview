# FeeOnTransfer 
(`IUniswapV2Router02` expands `IUniswapV2Router01` by providing FeeOnTransfer Functionality) 
Fee-on-Transfer support refers to a mechanism in some ERC-20 tokens where a portion of the transferred
amount is deducted as a fee whenever tokens are sent or swapped. This fee is often redistributed or burned, 
depending on the token's design, and is implemented to incentivize holding or contribute to the project's development

# withPermit
When removing liquidity we should sign on transactions to let the router to access our tokens and send it back
to us, this problem isn’t actual when creating the liquidity, because we send the tokens ourselves to router
