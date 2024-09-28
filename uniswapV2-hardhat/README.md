# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a UniswapV2 contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

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

To verify the contract on polygonscan
```shell
npx hardhat verify --constructor-args arguments_router.js 'CONTRACT_ADDRESS' --network polygonAmoy
``` 

# Configs
Changes were made in `hardhat.config.js` file to properly configure the project

`UniswapV2Router` and `UniswapV2Factory` use different solidity compilers, so those were added (`0.6.6` and `0.5.16`)

Our project intends to deploy Solidity smart contract to Polygon's **Amoy** testnet. For this we need to create API and get the key from the RPC provider. I personally used **Alchemy** for this. Also for further analysis and verification **Polygonscan** was chosen and appropriate API was created. `RPC_URL` together with testnets `PrivateKey` is provided in .env to configure Amoy in `networks`
section of `hardhat.config.js`, as well as `POLYGONSCAN_API_KEY`




