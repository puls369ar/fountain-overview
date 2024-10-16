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
* `bool public rewardsPaused` - Is printing rewards paused, regardless of ratios

* `uint32 public secondsAgoTwap = 60 * 7`

Masonry
* `address public masonry` - Address of Masonry, later will be casted into `IModernMasonry` to use it's `allocateRewards()` function


# Modifiers
`checkEpoch` - Ensures that an epoch is completed before proceeding with specific actions like distributing rewards `block.timestamp >= nextEpochPoint(); currentEpoch = currentEpoch + 1;`
`checkIfStarted` - Ensures that the treasury has started before allowing certain functions to run `block.timestamp >= firstEpochStartTime`

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

* `nextEpochPoint()` - Returns the next epoch timestamp by calculating how much time passed since first epoch `currentEpoch * epochLength` and then adding it to the timestamp of the first epoch `firstEpochStartTime`
```solidity
function nextEpochPoint() public view returns (uint256) {
  return firstEpochStartTime + (currentEpoch * epochLength);
}
```

# Contracts and Interfaces
* `IOralce` - an interface to interact with `Oracle` contract with only `twap()` function provided
* `IModernMasonry` - an interface to interact with `ModernMasonry` instance casted from `masonry` address providing only `allocateRewards()` function 
