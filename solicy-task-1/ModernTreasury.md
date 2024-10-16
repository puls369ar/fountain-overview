# Variables
Epoch Management
* `epochLength` - The length of time for each epoch (e.g., reward distribution cycle).
* `firstEpochStartTime` - The time when the first epoch begins.
* `currentEpoch` - Keeps track of the current epoch. It is incremented everytime someone allocates the reward inside the `checkEpoch` modifier used by `allocateRewards()` 

Token Ratios
* `uint256 public expectedRatioOne`, `uint256 public expectedRatioTwo` - Target price ratios for the token pairs that must be met for rewards to be distributed.
* `IOracle public ratioOneOracle`, `IOracle public ratioTwoOracle` - Oracles that provide the price for each token pair.
* `address public ratioOneToken`, `address public ratioTwoToken` - The main tokens used in the price ratio calculations.
* `uint256 public previousEpochRatioOnePrice`, `uint256 public previousEpochRatioTwo` - Prices of the main token in the first and second pairs at the end of the previous epoch

Reward Distribution
* `uint256 public tokensPerEpoch` - Number of reward tokens distributed per epoch
* `uint256 public daoFundSharedPercent, `uint256 public devFundSharedPercent` - Percentages of the rewards allocated to the DAO and DEV funds
* `address public daoFund`, `address public devFund` - Addresses of DAO and DEV funds
* `IERC20 public rewardToken` - The ERC20 token distributed as the reward
* `bool public rewardsPaused` - Is printing rewards paused, regardless of ratios, `allocateRewards()` won't work unless it is set to `FALSE`

Masonry
* `address public masonry` - Address of Masonry, later will be casted into `IModernMasonry` to use it's `allocateRewards()` function

* `uint32 public secondsAgoTwap = 60 * 7` - holds a value representing how far back in time the Time-Weighted Average Price (TWAP) should be calculated. However, in the provided contract code, secondsAgoTwap is declared but not used anywhere

# Modifiers
* `checkEpoch` - Ensures that an epoch is completed before proceeding with specific actions like distributing rewards `block.timestamp >= nextEpochPoint(); currentEpoch = currentEpoch + 1;`
* `checkIfStarted` - Ensures that the treasury has started before allowing certain functions to run `block.timestamp >= firstEpochStartTime`

# Functions
* `constructor` - first of all the highest role is given to the sender and then some values are given by the sender
```solidity
_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
epochLength = _epochLength;
firstEpochStartTime = _firstEpochStartTime;
expectedRatioOne = _expectedRatioOne;
expectedRatioTwo = _expectedRatioTwo;
rewardToken = IERC20(_rewardToken);
ratioOneOracle = IOracle(_ratioOneOracle);
ratioOneToken = _ratioOneToken;
ratioTwoOracle = IOracle(_ratioTwoOracle);
ratioTwoToken = _ratioTwoToken;
```

* `getRatioOneMainTokenTwap()` - Returns a TWAP (Time Weighted Average Price) of the main token calculated since the last oracle update until now, for the first token ratio using `ratioOneOracle.twap(ratioOneToken, 1e18)`
* `getRatioTwoMainTokenTwap()` - Returns a TWAP (Time Weighted Average Price) of the main token calculated since the last oracle update until now, for the second token ratio using `ratioOneOracle.twap(ratioSecondToken, 1e18)`

* `allocateRewards()` - The function starts with nonReentrant and checkIfStarted modifiers to prevent reentrant calls and ensure that the treasury has started



  It retrieves the Time Weighted Average Price (TWAP) for both token ratios using getRatioOneMainTokenTwap() and getRatioTwoMainTokenTwap()
  These prices represent the average prices for the tokens over the specified epoch period.

  The function checks if rewards are not paused (!rewardsPaused) and if there are tokens available to distribute (tokensPerEpoch > 0)
  It further checks if the retrieved prices exceed the expected ratios (previousEpochRatioOne > expectedRatioOne and previousEpochRatioTwo > expectedRatioTwo)
  Check Balance:

  It verifies if there are enough reward tokens in the contract to distribute (rewardToken.balanceOf(address(this)) >= tokensPerEpoch)
  Distribute to DAO Fund:

  If the percentage for the DAO fund (daoFundSharedPercent) is greater than 0, it calculates how many tokens will go to the DAO fund.
  It transfers the calculated amount from the treasury to the DAO fund and emits an event (DaoFundFunded).
  Distribute to Development Fund:

  Similar to the DAO fund, if the development fund percentage (devFundSharedPercent) is greater than 0, it calculates the share for the development fund.
  It transfers the calculated amount from the treasury to the development fund and emits an event (DevFundFunded).
  Transfer Remaining Rewards to Masonry:

  It calculates the remaining reward tokens after funding the DAO and development funds.
  The contract then approves the remaining amount for the masonry contract and calls allocateRewards on it, passing the remaining reward amount.
  An event (MasonryFunded) is emitted to indicate that the rewards have been funded to the masonry contract.
  Event Emission:

  Finally, it emits an event (CalledAllocateRewards) with details about the call and the ratios for reference.
```solidity
function allocateRewards() external nonReentrant checkIfStarted checkEpoch {
  require(masonry != address(0), "Masonry address cannot be 0");
  previousEpochRatioOne = getRatioOneMainTokenTwap();
  previousEpochRatioTwo = getRatioTwoMainTokenTwap();

  if (!rewardsPaused && tokensPerEpoch > 0) {
    if (previousEpochRatioOne > expectedRatioOne && previousEpochRatioTwo > expectedRatioTwo) {
      require(
        rewardToken.balanceOf(address(this)) >= tokensPerEpoch,
          "Not enough reward tokens in the contract"
        );

        uint256 _daoFundSharedAmount = 0;
        if (daoFundSharedPercent > 0) {
          _daoFundSharedAmount = (tokensPerEpoch * daoFundSharedPercent) / 10000;
          rewardToken.safeTransfer(daoFund, _daoFundSharedAmount);
          emit DaoFundFunded(msg.sender, daoFund, _daoFundSharedAmount);
        }

        uint256 _devFundSharedAmount = 0;
        if (devFundSharedPercent > 0) {
          _devFundSharedAmount = (tokensPerEpoch * devFundSharedPercent) / 10000;
          rewardToken.safeTransfer(devFund, _devFundSharedAmount);
          emit DevFundFunded(msg.sender, devFund, _devFundSharedAmount);
        }

        uint256 rewardsAmount = tokensPerEpoch - (_daoFundSharedAmount + _devFundSharedAmount);
        rewardToken.safeApprove(masonry, 0);
        rewardToken.safeApprove(masonry, rewardsAmount);

        IModernMasonry(masonry).allocateRewards(rewardsAmount);
        emit MasonryFunded(msg.sender, rewardsAmount);
    }
  }

  emit CalledAllocateRewards(msg.sender, previousEpochRatioOne, previousEpochRatioTwo);
}
```

Epoch management
* `nextEpochPoint()` - Returns the next epoch timestamp by calculating how much time passed since first epoch `currentEpoch * epochLength` and then adding it to the timestamp of the first epoch `firstEpochStartTime`
```solidity
function nextEpochPoint() public view returns (uint256) {
  return firstEpochStartTime + (currentEpoch * epochLength);
}
```

* `pauseRewards()` - Pauses rewards from being emitted independent of the ratios by setting `rewardsPaused` to `TRUE` [PAUSER_ROLE]
* `unpauseRewards()` - Resumes rewards emissions, by setting `rewardsPaused` to `FALSE` [PAUSER_ROLE]

* `recoverUnsupportedTokens()`

Setters
* `setTokensPerEpoch()` Set - the amount of reward tokens emitted each epoch when both ratios are met, modifies `tokensPerEpoch` [REWARD_ADMIN_ROLE]

* `setExpectedRatioOne` - Set price ratio for the main token in the first token pair, which needs to be met to emit rewards, modifies `expectedRatioOne` [ORACLE_ADMIN_ROLE]
* `setExpectedRatioOne` - Set price ratio for the main token in the second token pair, which needs to be met to emit rewards, modifies `expectedRatioTwo` [ORACLE_ADMIN_ROLE]

* `setRewardToken()` - Set new reward token address [REWARD_TOKEN_ADMIN_ROLE]

* `setDaoFund()` - Set new DAO fund address, modifying `daoFund` [DAO_FUND_ADMIN_ROLE]
* `setDaoFundSharedPercent()` - Set percentage of rewards which will be send to DAO fund, modifying `daoFundSharedPercent` [DAO_FUND_ADMIN_ROLE]
* `setDevFund()` - Set new DEV fund address, modifying `devFund` [DEV_FUND_ADMIN_ROLE]
* `setDevFundSharedPercent()` - Set percentage of rewards which will be send to DEV fund, modifying `devFundSharedPercent` [DEV_FUND_ADMIN_ROLE]

* `setRatioOneOracle()` - Set address of oracle used for calculating ratio for the first pair, modifying `ratioOneOracle` [ORACLE_ADMIN_ROLE]
* `setRatioTwoOracle()` - Set address of oracle used for calculating ratio for the second pair, modifying `ratioTwoOracle` [ORACLE_ADMIN_ROLE]

* `setMasonry()` - Set address of masonry, modifies `masonry` [DEFAULT_ADMIN_ROLE]
* `setSecondsAgoTwap()` - Set how many seconds are used in twap calculation, modifies secondsAgoTwap [ORACLE_ADMIN_ROLE]


# Contracts, Interfaces and Libraries
* `IOralce` - an interface to interact with `Oracle` contract with only `twap()` function provided
* `IModernMasonry` - an interface to interact with `ModernMasonry` instance casted from `masonry` address providing only `allocateRewards()` function
* `IERC20` - to Interact with ERC20 tokens
* `SafeERC20` - to extend IERC20 capabilites by `using SafeERC20 for IERC20` 
