# Asset accessibility
* Public - Accessible from everywhere
* Private - Only from the contract the asset is in, not from child contracts
* Internal - Only from the contract and from the child contracts
* External - Accessible only from the outside 

# Functions
* Virtual - the asset that has to be overridden by a child contract
* Override - the asset that overrides inherited assets marked as `virtual` previously
* Pure - function that doesn’t use any asset from contract

# Variables
Calldata - Variables declared as `calldata` cannot be modified. This makes it a safe choice when you only need to read data without altering 

external->public?
