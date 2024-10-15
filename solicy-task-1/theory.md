* `Fountain` and `ModernTreasury` are both deFi dApps that work with each other and help in reward distribution. They exist in different blockchain platforms, but I research Polygon's instances for our case
* So as I get `Fountain` is a feature in LIF3 that later was separated as a smart contract in different blockchains
* Default swapper of `Tomb` is lif3

# Chains

## LIF3
It is a complex DeFi ecosystem providing many tools. It is interoperable between these blockchains
* BNB
* Fantom
* Polygon
* Tomb

Ecosystem
* L3 Wallet
* L3 Chain
* L3 Trade

Coins
* LIF3
* LSHARE

## Fantom
* _Consensus_: Lachesis (ABFT)
* _TPS_: 2000

## Tomb
L2 solution for Fantom chain

# MathBehind

# Fountain Contract
[contract](https://polygonscan.com/address/0x35d730cd8c9984916A7E0AC11eAc4Fcff17fD6c5#code)

## Interface Diagram
Fountain->(ShareWrapper,ReentrancyGuard,AccessControl->IAccessControl)

## All Contracts, Libs and Interfaces
### ShareWrapper
This is the parent contract that provides the core staking functionality.

Variables
* `IERC20 public share`: The ERC20 token that users will stake.
* `uint256 private _totalSharesStaked`: Tracks the total amount of tokens staked.
* `mapping(address => uint256) private _balances`: Tracks how many tokens each address has

Functions
* `totalSharesStaked()` - Returns _totalSharesStaked parameter
* `balanceOf(address account)` - Returns the staked balance for a specific user from _balances variable (`_balances[account]`)
* `stake(uint256 amount)` - Users can stake a specified amount of tokens. The tokens are transferred from the user's account to the contract
```solidity
function stake(uint256 amount) public virtual {
  _totalSharesStaked = _totalSharesStaked + amount;
  _balances[msg.sender] = _balances[msg.sender] + amount;
  share.safeTransferFrom(msg.sender, address(this), amount);
}
```
By the way `safeTransferFrom` is a function that was inherited from SafeERC20

* `withdraw(uint256 amount)` - Users can withdraw a specified amount of their staked tokens, provided they have enough staked
```solidity
function withdraw(uint256 amount) public virtual {
  uint256 masonShare = _balances[msg.sender];
  require(masonShare >= amount, "Masonry: withdraw request greater than staked amount");
  _totalSharesStaked = _totalSharesStaked - amount;
  _balances[msg.sender] = masonShare - amount;
  share.safeTransfer(msg.sender, amount); // Function overloading where we don't set the sender. `address(this)` by default
}
```



### AccessControl
By inheriting from this **Fountain** contract gets role managing mechanism provided by **@openzeppelin**.
* `grantRole(bytes32 role, address account)` - Grants a specific role to an account. Only callable by the admin of the role.
* `revokeRole(bytes32 role, address account)` - Revokes a specific role from an account. Only callable by the admin of the role.
* `renounceRole(bytes32 role, address account)` Allows an account to renounce their own role.
* `getRoleAdmin(bytes32 role)` - Returns the admin role that controls a specific role.
* `hasRole(bytes32 role, address account)` - Checks if an account has been granted a specific role.

Functions above use internal functions for more detailed proccessing
* `_setupRole(bytes32 role, address account)` - Sets up an initial role for an account (used in the constructor).
* `_setRoleAdmin(bytes32 role, bytes32 adminRole)` - Sets the admin role for a specific role.
* `_grantRole(bytes32 role, address account)` - Internal function that grants a role to an account without access restrictions.
* `_revokeRole(bytes32 role, address account)` - Internal function that revokes a role from an account without access restrictions 

`onlyRole()` modifier which when applied for the function extends
it's functionality to check if the sender has the role provided in `onlyRole()`. 

Kind of second layer solution analogy of **Solana's Authority Mechanism**. It's more improved version of `Ownable` contract
Example of how this used in `Fountain`
```solidity
function setFeeCollector(address _feeCollector) external onlyRole(FEE_ADMIN_ROLE) {
    require(_feeCollector != address(0), "Address cannot be 0");
    feeCollector = _feeCollector;
    emit FeeCollectorUpdated(msg.sender, _feeCollector);
}
```


The roles are created at the very top of the contract and in contract's constructor `msg.sender` is granted to manage roles when contract is deployed
```solidity
bytes32 public constant RECOVERER_ROLE = keccak256("RECOVERER_ROLE");
bytes32 public constant REWARD_TOKEN_ADMIN_ROLE = keccak256("REWARD_TOKEN_ADMIN_ROLE");
bytes32 public constant FEE_ADMIN_ROLE = keccak256("FEE_ADMIN_ROLE");

constructor() {
  _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
}
```

### ReentrancyGuard
The ReentrancyGuard contract from OpenZeppelin is a utility designed to help prevent reentrant calls to functions in smart contracts. Reentrancy is a common attack vector where an external contract calls back into the original contract before the first call has completed, potentially leading to inconsistent states or exploitation.

Variables
* `_NOT_ENTERED` - A constant that indicates the contract is not in a reentrant state (value = 1)
* `_ENTERED` - A constant that indicates the contract is currently in a reentrant state (value = 2)

This `nonReentrant()` modifier is applied to functions to prevent reentrant calls
```solidity
modifier nonReentrant() {
  _nonReentrantBefore();
  _;
  _nonReentrantAfter();
}
```

Functions
`_nonReentrantBefore()` - This function enforces the non-reentrancy check before executing the protected function. It ensures that if a function marked with nonReentrant is called, no other function marked as nonReentrant can be invoked.
`_nonReentrantAfter()` - This function resets the state after the function execution, allowing the contract to return to a non-reentrant state.
`_reentrancyGuardEntered()` - A helper function that returns true if the contract is currently in the reentrant state, which can be useful for internal checks.


### Second Party Contracts
* `IERC20` – To communicate with ERC20 instances
* `SafeERC20` – Library that usually extends ERC20 functionality by `using SafeERC20 for IERC20;`
* `Context` - abstract contract provided by OpenZeppelin, which serves as a base contract for other contracts in the OpenZeppelin library.
It provides information about the current execution context, including the address of the sender (`_msgSender()`)

ReentrancyGuard – @openzeppelin/contracts/security/ReentrancyGuard.sol
Operator – ./owner/Operator.sol
IModernTreasury – ./interfaces/IModernTreasury.sol

Fountain (main contract)
Masonseat (struct inside Fountain)
MasonrySnapshot (struct inside Fountain)
DEFAULT_ADMIN_ROLE (role inside Fountain)
RECOVERER_ROLE (role inside Fountain)
REWARD_TOKEN_ADMIN_ROLE (role inside Fountain)
FEE_ADMIN_ROLE (role inside Fountain)
feeCollector (address used in fee-related functions)
treasury (instance of IModernTreasury)
rewardToken (instance of IERC20)


# ToDO
* Learn Byzanthine Fault Tolerance and it's types AsynchronousBFT, IstanbulBFT and QuorumBFT
* Research Fantom Ecosystem

# Questions
* In IUniswapV2Factory there are `<LIF3> additions` section. What is the relation between these two
* Term `Treasury` used so much in the contents is the same `ModerTreasury` dApp?
* I dont get the math behind. How this logic is called, I want to research better ![image](https://github.com/puls369ar/soliciy-tasks/blob/main/solicy-task-1/image.png)
