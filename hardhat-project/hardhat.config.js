require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Hardhat Configuration
 * 
 * This configuration file sets up Hardhat with support for:
 * - Sepolia Testnet (for experimentation and testing)
 * - Ethereum Mainnet (for production deployment)
 * 
 * Environment variables required in .env:
 * - SEPOLIA_RPC_URL: RPC endpoint for Sepolia testnet
 * - MAINNET_RPC_URL: RPC endpoint for Ethereum mainnet
 * - PRIVATE_KEY: Your wallet's private key (DO NOT commit to version control)
 */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Sepolia Testnet - For experimentation and testing
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    // Ethereum Mainnet - For production deployment
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 1,
    },
    // Hardhat local network (for local testing)
    hardhat: {
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    // Add your Etherscan API key here for contract verification
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
