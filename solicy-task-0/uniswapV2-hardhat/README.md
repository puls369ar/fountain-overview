# Description

This project demonstrates a basic Hardhat use case. It comes with a UniswapV2 contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

`.sol` dApps are stored in `contracts` folder. Deployment scripts are in `ignition/modules` and test scripts (nor used, neither modified yet) are in `test` folder.

# Commands
To compile contracts
```shell
npx hardhat compile
```

To deploy each contract individually
```shell
npx hardhat ignition deploy ./ignition/modules/UniswapV2Router.js --network polygonAmoy
npx hardhat ignition deploy ./ignition/modules/UniswapV2Factory.js --network polygonAmoy
```

currently deployed. 
Polygonscan links
* Factory: https://amoy.polygonscan.com/address/0x7560258AB2B96E46E8e5cB5d0E657f621f547868#code
* Router: https://amoy.polygonscan.com/address/0x86aE117B73E4B197E26a3154C90F7131E3bee9B1#code


To verify the contract on polygonscan
```shell
npx hardhat verify --constructor-args <'ARGUMENT_FILE_FILENAME'> <'CONTRACT_ADDRESS'> --network polygonAmoy
``` 
When verifying the contract we give constructor parameter arguments in a separate javascript file. `arguments-factory.js` and `arguments-router.js` for each contract in our case.

# Configs
Changes were made in `hardhat.config.js` file to properly configure the project

`UniswapV2Router` and `UniswapV2Factory` use different solidity compilers, so those were added (`0.6.6` and `0.5.16`)

Our project intends to deploy Solidity smart contract to Polygon's **Amoy** testnet. For this we need to create API and get the key from the RPC provider. I personally used **Alchemy** for this. Also for further analysis and verification **Polygonscan** was chosen and appropriate API was created. `RPC_URL` together with testnets `PrivateKey` is provided in .env to configure Amoy in `networks`
section of `hardhat.config.js`. Also `POLYGONSCAN_API_KEY` was set here with the use of command
```shell
npx hardhat vars set POLYGONSCAN_API_KEY
```




