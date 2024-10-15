require("@nomicfoundation/hardhat-toolbox");

require("dotenv/config");

// const { network } = require("hardhat");
const {vars} = require("hardhat/config")
const oklinkkey=vars.get("okLink_APi_key")
const polygonscan=vars.get("POLYGONSCAN_API_KEY")


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      
    ]
  },
  
  networks: {
    polygonAmoy: {
      url: process.env.RPC_URL,
      accounts: [process.env.Privatekey],
      
    }
  },
  etherscan: {
    
    apiKey:{
      polygonAmoy: polygonscan,
    }
  }
};
