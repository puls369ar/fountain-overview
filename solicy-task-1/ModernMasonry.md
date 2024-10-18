# ModernMasonry [Contract](https://polygonscan.com/address/0x35d730cd8c9984916A7E0AC11eAc4Fcff17fD6c5#code)

The Fountain contract you're analyzing has several core functionalities centered around staking, rewards, governance, and access control. 
It is inherited from and has the functionality of three Contracts we've already discussed
* `AccessControl`
* `ReentrancyGuard`
* `ShareWrapper`


# Roles
* `RECOVERER_ROLE` - Allows recovery of unsupported tokens.
* `REWARD_TOKEN_ADMIN_ROLE` - Governs the ability to set the reward token.
* `FEE_ADMIN_ROLE` - Controls settings related to deposit fees.


# Structs
* `Masonseat` - Stores data for individual stakers, like reward state and timing info.
* `MasonrySnapshot` - Keeps track of reward distribution snapshots.


# Mappings and Arrays
* `masons` - Maps addresses to their staker data (Masonseat), evaluated when staking in `ShareWrapper` overriden `stake()` function .
* `masonryHistory` - Array of MasonrySnapshot structs tracking the reward history.

# Modifiers
* `onlyTreasury` - Restricts certain functions to the Treasury.
* `masonExists` - Ensures the user has tokens staked.
* `updateReward` - Updates reward calculations for a user before proceeding with function logic, more particularly `rewardEarned` and `updateReward` parameters of `masons(address->Masonseat{epochTimerStart,rewardEarned,lastSnapshotIndex})` before
`stake()` and `claimReward()` functions are performed (epochTimerStart is inside the functions)
* `notInitialized` - Ensures the contract can only be initialized once

# Variables
* `IERC20 public rewardToken` - This represents the ERC-20 token that is distributed to users as a reward for staking. Users stake their share tokens, and in return, they earn rewards in this rewardToken.
The contract uses OpenZeppelin's SafeERC20 to handle the safe transfer of this reward token, preventing issues like failed transfers.

* `IModernTreasury public treasury` - The treasury is a contract responsible for funding and allocating rewards to the Fountain contract. It plays a vital role in the reward distribution process by calling allocateRewards to distribute the rewards each epoch.
The treasury also governs when users can withdraw staked tokens or claim rewards, as it controls the epoch system (currentEpoch and nextEpochPoint)

* `bool public initialized = false` - Is contract already initialized for `notInitialized` modifier, set in `initialize()` function
  
* `uint256 public withdrawLockupEpochs` - How many epochs need to pass, since last interaction (`stake()`, `claimReward`, `withdraw`), before user can withdraw staked tokens
* `uint256 public rewardLockupEpochs` - How many epochs need to pass, since last interaction (`stake()`, `claimReward`, `withdraw`), before user can claim rewards


* `uint256 public depositFee` - Deposit fee in % paid in deposit token (100 == 1%)
* `address public feeCollector` - Recipient address of deposit fees

Functions

These variables together with `share` coming from `ShareWrapper`, together with masonryHistory(except fee related ones) are initialized by the following function

```solidity
function initialize(
  IERC20 _rewardToken,
  IERC20 _share,
  IModernTreasury _treasury
) external notInitialized onlyRole(DEFAULT_ADMIN_ROLE)
{
  rewardToken = _rewardToken;
  share = _share;
  treasury = _treasury;

  MasonrySnapshot memory genesisSnapshot = MasonrySnapshot({
    time: block.number,
    rewardReceived: 0,
    rewardPerShare: 0
  });
  masonryHistory.push(genesisSnapshot);

  withdrawLockupEpochs = 6; // Lock for 6 epochs (36h) before release withdraw
  rewardLockupEpochs = 3; // Lock for 3 epochs (18h) before release claimReward

  initialized = true;
  emit Initialized(msg.sender, block.number);
}
```

Only account that has the role `onlyRole(DEFAULT_ADMIN_ROLE)`
can call `initialize` function and in our case it is the account that deployed the contract as we've seen when discussing `AccessControl`
```solidity
constructor() {
  _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
}
```

Snapshot getters
* `latestSnapshotIndex()` - Retrieves the last Masonry snapshot index
```solidity
function latestSnapshotIndex() public view returns (uint256) {
  return masonryHistory.length - 1;
}
```

* `getLatestSnapshot()` - Retrieves the latest Masonry snapshot
```solidity
function getLatestSnapshot() internal view returns (MasonrySnapshot memory) {
  return masonryHistory[latestSnapshotIndex()];
}
```

* `getLastSnapshotOf()` - Retrieves the last Masonry snapshot used by user for updating rewards
```solidity
function getLastSnapshotOf(address mason) internal view returns (MasonrySnapshot memory) {
  return masonryHistory[getLastSnapshotIndexOf(mason)];
}
```

* `getLastSnapshotIndexOf()` - Retrieves an index of Masonry Snapshot which was the last one used for updating rewards for specific user
```solidity
function getLastSnapshotIndexOf(address mason) public view returns (uint256) {
  return masons[mason].lastSnapshotIndex;
}
```

* `rewardPerShare()` - Retrieves the amount of rewards per share from the last Masonry snapshot
```solidity
function rewardPerShare() public view returns (uint256) {
  return getLatestSnapshot().rewardPerShare;
}
```

`depositFee` and `feeCollector` are set by folowing functions (FEE_ADMIN_ROLE)
* `setFeeCollector()` - Updates the address that receives deposit fees 
* `setDepositFee()` - Adjusts the deposit fee, which is deducted from staked amounts.

Also `rewardToken` can be changed by `setRewardToken()` function (REWARD_TOKEN_ADMIN_ROLE) as well as
`withdrawLockupEpochs` and  `rewardLockupEpochs` numbers can be changed by `setLockup()`(DEFAULT_ADMIN_ROLE).
Allows the admin to adjust lockup periods for withdrawing staked tokens and claiming rewards





* `allocateRewards()` - Called inside `ModernTreasury` contract's `allocateRewards()` function to distribute rewards. It updates the reward per share and records the allocation in a new MasonrySnapshot. This function is protected against reentrancy attacks
* `eaned()`
```solidity
function earned(address mason) public view returns (uint256) {
  uint256 latestRPS = getLatestSnapshot().rewardPerShare;
  uint256 storedRPS = getLastSnapshotOf(mason).rewardPerShare;
  return ((balanceOf(mason) * (latestRPS - storedRPS)) / 1e18) + masons[mason].rewardEarned;
}
```


`Fountain` contract overrides `stake()` and `withdraw()` functions
* stake() - functionality of *noZero* check for the `amount` added, also fee handling 
```solidity
/// Stakes deposit tokens in the contract in order to earn rewards every time they are allocated by the Treasury
/// @param amount Amount of deposit tokens to stake
function stake(uint256 amount) public override nonReentrant updateReward(msg.sender) {
  require(amount > 0, "Masonry: Cannot stake 0");

  masons[msg.sender].epochTimerStart = treasury.currentEpoch(); // reset timer


  // Calculating `depositFeeAmount` and sending it to `feeCollector`, then saving the rest in `adjustedAmount` 
  uint256 adjustedAmount = amount;
  uint256 depositFeeAmount = 0;
  if (depositFee > 0) {
    depositFeeAmount = (amount * depositFee) / 10000;
    adjustedAmount = amount - depositFeeAmount;
    share.safeTransferFrom(msg.sender, feeCollector, depositFeeAmount);
  }
  super.stake(adjustedAmount);
  emit Staked(msg.sender, amount, depositFeeAmount);
}
```

* withdraw() - When calling it first it checks epoch lockup, then it claims all the rewards
gathered during the staking and only after it performs classical withdrawal proccess inherited from `ShareWrapper`

```solidity
/// Withdraws deposit tokens and claims rewards from the contract
/// @param amount Amount of deposit tokens to withdraw
function withdraw(uint256 amount) public override nonReentrant masonExists {
  require(amount > 0, "Masonry: Cannot withdraw 0");
  require(
    (masons[msg.sender].epochTimerStart + withdrawLockupEpochs) <= treasury.currentEpoch(),
    "Masonry: still in withdraw lockup"
  );
  claimReward();
  super.withdraw(amount);
  emit Withdrawn(msg.sender, amount);
}
```

* claimReward() - After checking for reward's noZero and rewardLockup 
period it updates the epoch clock, set's to zero it's `rewardEarned` value and sends that amount to the caller
```solidity
function claimReward() public masonExists updateReward(msg.sender) {
  uint256 reward = masons[msg.sender].rewardEarned;
  if (reward > 0) {
    require(
      (masons[msg.sender].epochTimerStart + rewardLockupEpochs) <= treasury.currentEpoch(),
      "Masonry: still in reward lockup"
    );
    masons[msg.sender].epochTimerStart = treasury.currentEpoch(); // reset timer
    masons[msg.sender].rewardEarned = 0;
    rewardToken.safeTransfer(msg.sender, reward);
    emit RewardPaid(msg.sender, reward);
  }
}
```
* `exit` - withdraws all funds of the user calling
```solidity
function exit() external {
  withdraw(balanceOf(msg.sender)); // From `ShareWrapepr`
}
```
Note that caller's `rewardEarned` value is first updated by `updateReward` modifier by calling `earned()` function, but it is only for the case when modifying the state after performing `stake()`, so this change 
is manually overwritten in `claimReward()` proccess to make sure that this value is nullified before sending reward to the caller


### Second Party Contracts
* `IERC20` – To communicate with ERC20 instances
* `SafeERC20` – Library that usually extends ERC20 functionality by `using SafeERC20 for IERC20;`
* `Context` - abstract contract provided by OpenZeppelin, which serves as a base contract for other contracts in the OpenZeppelin library.
It provides information about the current execution context, including the address of the sender (`_msgSender()`)
* `IModernTreasury` - provides an interface with reduced functionality (just `currentEpoch` and `nextEpochPoint` functions) to create `treasury` instance variable inside `Fountain` and work with epochs through that variable
* Operator – ./owner/Operator.sol

## Interface Diagram
Fountain->(ShareWrapper,ReentrancyGuard,AccessControl->IAccessControl)

