All used Interfaces, their relations and descriptions
* UniswapV2Factory<-IUniswapV2Factory
* UniswapV2Pair<-IUniswapV2Pair, {UniswapV2ERC20<-IUniswapV2ERC20}
* `IUniswapV2Callee` for the case when external smart contract that implements `IUniswapV2Callee::uniswapV2Call()` function calls to  * `UniswapV2Pair::swap()` function
* `IERC20` to check the balances from the token contract
