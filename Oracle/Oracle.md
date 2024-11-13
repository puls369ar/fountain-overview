# Oracle [Contract](https://polygonscan.com/address/0x2d68beBe887975C3D48A95B876851B7429Af373c#code)

Accessability management here is organized via `Operator` contract through `onlyOwner` moodifier. `Operator`  himself inherits from **openzeppelin**'s `Context` and `Ownable` conrtacts and it's mechanisms simpler then `AccessControl` mechanism is

# Variables
* `uint256 public period` - TWAP period (time-weighted average price), The interwal after which prices can be updates again
* `uint256 public consultLeniency = 120` - time period after which the price will considered stale
* `bool public allowStaleConsults = false` - Specifies whether stale consults are possible
* `address public token0` - First token in the Uniswap pair
* `address public token1` - Second token in the Uniswap pair
* `IUniswapV2Pair public pair` - Uniswap pair (LP token)
* `price0CumulativeLast` - Cumulative price of the first token in the pair - state for the last update
* `price1CumulativeLast` - Cumulative price of the second token in the pair - state for the last update
* `FixedPoint.uq112x112 public price0Average` - Average price of the first token in the pair - state for the last update
* `FixedPoint.uq112x112 public price1Average` - Average price of the second token in the pair - state for the last update
* `uint32 public blockTimestampLast` - Last update timestamp
  
# Functions

* `constructor()` - `UniswapV2Pair` LP instance is given from which addresses for target tokens (`token0`,`token1`), last prices (`price0CumulativeLast`,`price1CumulativeLast`) together with reserves and  time (`reserve0`, `reserve1`,`blockTimestampLast`) are extracted

```solidity
constructor(
    IUniswapV2Pair _pair,
    uint256 _period,
    uint256 _startTime
) Epoch(_period, _startTime, 0) {
    period = _period;
    pair = _pair;
    token0 = pair.token0();
    token1 = pair.token1();
    price0CumulativeLast = pair.price0CumulativeLast();
    price1CumulativeLast = pair.price1CumulativeLast();
    uint112 reserve0;
    uint112 reserve1;
    (reserve0, reserve1, blockTimestampLast) = pair.getReserves();
    require(reserve0 != 0 && reserve1 != 0, "Oracle: NO_RESERVES");
}
```

Setters
* `setNewPeriod()` - Sets a new TWAP `period`, calling `setPeriod()` function inherited from `Epoch`
* `setConsultLeniency()` - Sets a new consult leniency `consultLeniency` 
* `setAllowStaleConsults()` - Sets whether stale consults are allowed `allowStaleConsults`

* `canUpdate()` - Verifies whether the oracle is ready to be updated
  `return bool((UniswapV2OracleLibrary.currentBlockTimestamp() -  blockTimestampLast) >= period)`
* `update()` - cumulative prices and timestamp are returned from `UniswapV2OracleLibrary.currentCumulativePrices()` and given to `price0CumulativeLast`, `price1CumulativeLast`, `blockTimestampLast`
  Also it updates `price0Average` and `price1Average` after performing `nonZeroTimeElapsed` check `FixedPoint.uq112x112(uint224((price1Cumulative - price1CumulativeLast) / timeElapsed))`

* `consult()` - Returns the average price at the state from the last update. First it checks if we are in a valid time window `timeElapsed < (period + consultLeniency)) || allowStaleConsults` (Also check **Timing Logics** below)
  then returns the price of given token's address of given amount `price0Average.mul(_amountIn).decode144()` If the token isn't one of the target tokens transaction is reverted
* `twap()` - performs time window check as `consult()` and calculates and returns TWAP of given token of given input
```solidity
amount _amountOut = FixedPoint
  .uq112x112(uint224((price0Cumulative - price0CumulativeLast) / timeElapsed))
  .mul(_amountIn)
  .decode144()
```
  I don't know why, but token's validity check isn't performed


# Timing Logics
![Timing Logics](https://github.com/puls369ar/solicy-tasks/blob/main/solicy-task-1/images/TimingLogics.jpg)


