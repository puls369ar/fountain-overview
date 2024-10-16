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
* Contract Instance
To create instances from the exisitng contract address to interact with them
```solidity
MyContract(contract);       // Casting address -> MyContract to contract itself
IMyContract(contract);      // Casting address -> IMyContract to the interface that the contract implemented
```

Second method is much better as we need only functionality metadata for our interaction and no need to create an instance with the whole implementation
itself. Also this gives more flexibility, if we have another contract differenlty imlementing the same functionality casting to the same interface will work.
_**Remember**_ If the contract implements two or more interfaces then creating an instance by casting into the one of the interfaces will result in reduced functionality 
of an instance and you won't be available to use the implemented functionality of other interfaces
First method is ok only when we have to prevent the case described above, if we don't want to have separate interface for contracts functionality, because of complexity of the code or other reasons.


* All the uninitialized variables of the contract are set to their default values by default



## Special
* `receive()` - Function that's triggered when ETH is transferred directly using transfer() or send() functions. Or when ETH is received without any data in transaction
* `msg.sender` - The address in this function's scope that uses function to send ETH to contract


external->public?


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
