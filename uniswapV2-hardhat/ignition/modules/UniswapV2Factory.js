// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("UniswapV2FactoryModule", (m) => {
  
  const feeToSetter = '0xEA64985748BFdd6bC97878fF8C60C596Bbff2748'; // Replace with actual address
  const defaultMintFee = "100";  // Set your desired mint fee
  const defaultSwapFee = "200";   // Set your desired swap fee

  // Deploy the contract with the constructor arguments
  const dex = m.contract("UniswapV2Factory",
    [feeToSetter, defaultMintFee, defaultSwapFee]
  );

  return { dex };
});
