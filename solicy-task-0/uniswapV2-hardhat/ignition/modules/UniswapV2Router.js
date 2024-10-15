// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("UniswapV2RouterModule", (m) => {
  
  const factory = '0x67dC2703D306F72E94DbB0cE0aa0CB86149EAc70'; // Replace with actual address
  const WETH = "0x52eF3d68BaB452a294342DC3e5f464d7f610f72E";  // Set your desired mint fee

  // Deploy the contract with the constructor arguments
  const dex_router = m.contract("UniswapV2Router02",
    [factory, WETH]
  );

  return { dex_router };
});
