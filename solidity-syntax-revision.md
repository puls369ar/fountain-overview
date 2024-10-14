# Keywords
## Asset accessibility
* Public - Accessible from everywhere
* Private - Only from the contract the asset is in, not from child contracts
* Internal - Only from the contract and from the child contracts
* External - Accessible only from the outside 

## Functions
* Virtual - the asset that has to be overridden by a child contract
* Override - the asset that overrides inherited assets marked as `virtual` previously
* Pure - function that doesn’t use any asset from contract

## Variables
* Calldata - Variables declared as `calldata` cannot be modified. This makes it a safe choice when you only need to read data without altering
* Memory - the memory keyword is used to define a temporary location for data storage that is only valid for the lifetime of a function call. When you use memory, the data is not persisted after the function execution ends, which makes it ideal for temporary or intermediate computations 

# Other
* assembly - operator tells that the code in it's scope is a low-level EVM instruction
* using - used in interaction with Library's name and extends the type or contract with the methods it contains

## Features
* modifier - Helps code reduction by giving a possibility to create repetitive instruction patterns and
then apply them to the functions

```solidity
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender; // The deployer of the contract becomes the owner
    }

    // Define the modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _; // Continue with the function execution
    }

    // Function restricted by the onlyOwner modifier
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    // A normal function that anyone can call
    function openFunction() public view returns (string memory) {
        return "Anyone can call this";
    }
}

```


# OpenZeppelin
When the contract inherits from
```solidity
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
```
it acquires the mechanism of contract's role management. Below is the example of giving super admin status to the contract deployer
```solidity
constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
}
```

`_setUpRole()` and `DEFAULT_ADMIN_ROLE` are implemented assets inherited from `AccessControl` by our contract


external->public?
