# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a UniswapV2 contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

To compile contracts
```shell
npx hardhat compile
```

To deploy each contract individually
```shell
npx hardhat ignition deploy ./ignition/modules/UniswapV2Router.js --network polygonAmoy
npx hardhat ignition deploy ./ignition/modules/UniswapV2Factory.js --network polygonAmoy
```

To verify the contract on polygonscan
```shell
npx hardhat verify --constructor-args arguments_router.js 'CONTRACT_ADDRESS' --network polygonAmoy
``` 




