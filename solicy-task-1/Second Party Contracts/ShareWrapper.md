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
