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
`_reentrancyGuardEntered()` - A helper function that returns true if the contract is currently in the reentrant state, which can be useful for internal checks
