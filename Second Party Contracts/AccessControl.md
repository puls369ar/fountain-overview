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
