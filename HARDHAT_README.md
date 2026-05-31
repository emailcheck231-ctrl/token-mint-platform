# TokenMint: ERC-20 Token Deployment Guide

A comprehensive guide for developers to create, deploy, and manage ERC-20 tokens on Ethereum using Hardhat and OpenZeppelin. This guide covers both **Sepolia testnet** (for experimentation and learning) and **Ethereum mainnet** (for production deployment).

**Table of Contents**
1. [Project Setup with Hardhat and Replit](#1-project-setup-with-hardhat-and-replit)
2. [Writing a Simple ERC-20 Contract](#2-writing-a-simple-erc-20-contract)
3. [Configuring Hardhat with Network RPC URLs](#3-configuring-hardhat-with-network-rpc-urls)
4. [Creating a Deployment Script](#4-creating-a-deployment-script)
5. [Running Deployment on Sepolia and Mainnet](#5-running-deployment-on-sepolia-and-mainnet)
6. [Adding Tokens to MetaMask or Trust Wallet](#6-adding-tokens-to-metamask-or-trust-wallet)
7. [Setting Up Liquidity Pools on Uniswap](#7-setting-up-liquidity-pools-on-uniswap)
8. [Safety Considerations: Testnet vs. Mainnet](#8-safety-considerations-testnet-vs-mainnet)

---

## 1. Project Setup with Hardhat and Replit

### Local Setup

Begin by creating a new Hardhat project on your local machine. Hardhat is a development environment for Ethereum that makes it easy to write, test, and deploy smart contracts.

**Step 1: Create a new directory and initialize Node.js**

```bash
mkdir my-token-project
cd my-token-project
npm init -y
```

**Step 2: Install Hardhat and required dependencies**

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv ethers
```

**Step 3: Initialize Hardhat**

```bash
npx hardhat init
```

When prompted, select **"Create a TypeScript project"** or **"Create a JavaScript project"** (both work). Hardhat will generate a project structure with sample contracts and scripts.

**Step 4: Install additional tools**

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

### Replit Setup (Alternative)

If you prefer a browser-based development environment, Replit offers a convenient way to work with Hardhat without installing anything locally.

**Step 1: Create a new Replit project**

Visit [Replit.com](https://replit.com) and create a new project. Select **Node.js** as the template.

**Step 2: Install dependencies in Replit**

In the Replit shell, run:

```bash
npm install hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv ethers
npx hardhat init
```

**Step 3: Create .env file**

Create a `.env` file in the root directory (see [Section 3](#3-configuring-hardhat-with-network-rpc-urls) for details).

**Project Structure**

After initialization, your project should look like this:

```
my-token-project/
├── contracts/          # Smart contract files (.sol)
├── scripts/            # Deployment and utility scripts
├── test/               # Test files
├── hardhat.config.js   # Hardhat configuration
├── package.json        # Project dependencies
└── .env                # Environment variables (create this)
```

---

## 2. Writing a Simple ERC-20 Contract

An ERC-20 token is a standard smart contract that represents a fungible token on Ethereum. The standard defines a set of functions and events that all ERC-20 tokens must implement, ensuring compatibility with wallets, exchanges, and other applications.

### Understanding ERC-20

The ERC-20 standard specifies the following key functions:

| Function | Purpose |
|----------|---------|
| `transfer(to, amount)` | Transfer tokens from sender to recipient |
| `approve(spender, amount)` | Approve a third party to spend tokens on your behalf |
| `transferFrom(from, to, amount)` | Transfer tokens on behalf of another address |
| `balanceOf(account)` | Get the token balance of an address |
| `totalSupply()` | Get the total supply of tokens |
| `allowance(owner, spender)` | Get the approved amount for a spender |

### Creating MyToken.sol

Create a new file `contracts/MyToken.sol` with the following code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev A standard ERC-20 token with additional features:
 * - Burnable: Token holders can burn their tokens
 * - Pausable: Owner can pause/unpause token transfers
 * - Ownable: Owner can manage token permissions
 */
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) whenNotPaused {
        super._update(from, to, amount);
    }

    function decimals() public view override returns (uint8) {
        return 18;
    }
}
```

### Understanding the Contract

**Imports from OpenZeppelin:**

- **ERC20**: The base ERC-20 token implementation
- **ERC20Burnable**: Allows token holders to burn (destroy) their tokens
- **ERC20Pausable**: Allows the owner to pause all token transfers in emergencies
- **Ownable**: Provides access control so only the owner can call certain functions

**Constructor Parameters:**

- `initialSupply`: The total number of tokens to create (in the smallest unit, wei)
- `tokenName`: The human-readable name (e.g., "My Token")
- `tokenSymbol`: The ticker symbol (e.g., "MTK")

**Key Functions:**

- `pause()` / `unpause()`: Emergency controls to halt transfers
- `mint()`: Create new tokens (only owner can call)
- `decimals()`: Returns 18, meaning 1 token = 10^18 wei

### Calculating Initial Supply

If you want to create 1,000,000 tokens with 18 decimals:

```
initialSupply = 1,000,000 * 10^18 = 1000000000000000000000000
```

In JavaScript/Hardhat:

```javascript
const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens
```

---

## 3. Configuring Hardhat with Network RPC URLs

Hardhat needs RPC (Remote Procedure Call) endpoints to connect to Ethereum networks. An RPC endpoint is a server that allows your code to communicate with the blockchain.

### Getting RPC URLs

You can obtain free RPC URLs from several providers:

| Provider | Website | Free Tier |
|----------|---------|-----------|
| Infura | https://www.infura.io/ | Yes (free account) |
| Alchemy | https://www.alchemy.com/ | Yes (free account) |
| QuickNode | https://www.quicknode.com/ | Yes (free account) |
| Ankr | https://www.ankr.com/ | Yes (free account) |

**Steps to get an Infura RPC URL:**

1. Visit [Infura.io](https://www.infura.io/)
2. Sign up for a free account
3. Create a new project
4. Copy your Sepolia and Mainnet RPC URLs

### Creating .env File

Create a `.env` file in your project root with the following content:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
```

**⚠️ SECURITY WARNING:**

- **Never commit `.env` to version control.** Add `.env` to your `.gitignore` file.
- **Never share your private key.** Anyone with your private key can access and transfer your funds.
- Use a dedicated wallet with limited funds for testing, not your main wallet.
- For mainnet deployments, consider using a hardware wallet or multi-signature wallet.

### Configuring hardhat.config.js

Update your `hardhat.config.js` to include Sepolia and Mainnet networks:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

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
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
```

### Understanding Network Configuration

- **Sepolia**: Chain ID 11155111 (testnet, test ETH has no value)
- **Mainnet**: Chain ID 1 (production, real ETH required)
- **RPC URL**: The endpoint to communicate with the network
- **Accounts**: Array of private keys (Hardhat will use the first one for deployments)

---

## 4. Creating a Deployment Script

A deployment script automates the process of compiling, deploying, and verifying your contract.

### Create scripts/deploy.js

Create a new file `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting token deployment...\n");

  // Get network info
  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  console.log(`📡 Network: ${network} (Chain ID: ${chainId})`);

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  console.log(`💰 Account balance: ${balanceInEth} ETH\n`);

  // Token configuration
  const TOKEN_NAME = "My Token";
  const TOKEN_SYMBOL = "MTK";
  const INITIAL_SUPPLY = hre.ethers.parseEther("1000000");

  console.log("📋 Token Configuration:");
  console.log(`   Name: ${TOKEN_NAME}`);
  console.log(`   Symbol: ${TOKEN_SYMBOL}`);
  console.log(`   Initial Supply: ${hre.ethers.formatEther(INITIAL_SUPPLY)} ${TOKEN_SYMBOL}\n`);

  // Mainnet warning
  if (network === "mainnet") {
    console.log("⚠️  WARNING: Deploying to ETHEREUM MAINNET!");
    console.log("   This will cost real ETH and is permanent.\n");
  }

  // Deploy contract
  console.log("🔨 Deploying MyToken contract...");
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL);

  await myToken.waitForDeployment();
  const contractAddress = await myToken.getAddress();

  console.log(`✅ Contract deployed successfully!\n`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Block Explorer: ${getBlockExplorerUrl(network, contractAddress)}\n`);

  // Display token details
  const totalSupply = await myToken.totalSupply();
  const decimals = await myToken.decimals();

  console.log("📊 Token Details:");
  console.log(`   Total Supply: ${hre.ethers.formatEther(totalSupply)} ${TOKEN_SYMBOL}`);
  console.log(`   Decimals: ${decimals}`);
}

function getBlockExplorerUrl(network, contractAddress) {
  if (network === "sepolia") {
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
  } else if (network === "mainnet") {
    return `https://etherscan.io/address/${contractAddress}`;
  }
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
```

### Script Breakdown

The deployment script performs the following steps:

1. **Get network information**: Determines which network (Sepolia or Mainnet) is being used
2. **Get deployer account**: Retrieves the account that will deploy the contract
3. **Check balance**: Verifies sufficient ETH for gas fees
4. **Configure token**: Sets the token name, symbol, and initial supply
5. **Deploy contract**: Compiles and deploys the contract to the network
6. **Display results**: Shows the contract address and token details
7. **Block explorer link**: Provides a link to view the contract on Etherscan

---

## 5. Running Deployment on Sepolia and Mainnet

### Compile the Contract

Before deploying, compile your contract to check for errors:

```bash
npx hardhat compile
```

You should see output like:

```
Compiling 1 file with 0.8.20
Solidity compilation finished successfully
```

### Deploy to Sepolia (Testnet)

Sepolia is the recommended testnet for Ethereum. It uses test ETH that has no real value, making it perfect for experimentation.

**Step 1: Get test ETH**

Visit a Sepolia faucet to receive free test ETH:

- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

**Step 2: Deploy to Sepolia**

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:

```
🚀 Starting token deployment...

📡 Network: sepolia (Chain ID: 11155111)
👤 Deployer: 0x1234567890123456789012345678901234567890
💰 Account balance: 0.5 ETH

📋 Token Configuration:
   Name: My Token
   Symbol: MTK
   Initial Supply: 1000000 MTK

🔨 Deploying MyToken contract...
✅ Contract deployed successfully!

📍 Contract Address: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
🔗 Block Explorer: https://sepolia.etherscan.io/address/0xabcdefabcdefabcdefabcdefabcdefabcdefabcd

📊 Token Details:
   Total Supply: 1000000 MTK
   Decimals: 18
```

**Save the contract address** — you'll need it for the next steps.

### Deploy to Mainnet (Production)

**⚠️ CRITICAL WARNINGS:**

- Mainnet deployment is **permanent and irreversible**.
- You will spend **real ETH** on gas fees.
- Ensure your contract has been thoroughly tested on Sepolia first.
- Consider having your contract audited by a security firm before mainnet deployment.
- Ensure you have sufficient ETH in your wallet to cover gas fees.

**Step 1: Ensure sufficient ETH**

Check your wallet balance. Gas fees for deployment typically cost 0.01-0.05 ETH depending on network congestion.

**Step 2: Deploy to Mainnet**

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

The deployment process is identical to Sepolia, but it will use real ETH and deploy to the production Ethereum network.

### Verifying Deployment

After deployment, verify your contract on Etherscan:

1. Visit the contract address on Etherscan (link provided in deployment output)
2. Click **"Verify and Publish"**
3. Select **"Solidity (Single file)"** as the compiler type
4. Upload your `MyToken.sol` file
5. Confirm the contract details

Verification allows anyone to view and audit your contract's source code on Etherscan.

---

## 6. Adding Tokens to MetaMask or Trust Wallet

After deployment, you can add your token to your wallet so you can see your balance and transfer tokens.

### Adding to MetaMask

**Step 1: Open MetaMask**

Open the MetaMask browser extension and ensure you're on the correct network (Sepolia or Mainnet).

**Step 2: Click "Import Token"**

Click the **"Import tokens"** button at the bottom of the token list.

**Step 3: Enter Token Details**

Fill in the following information:

| Field | Value |
|-------|-------|
| Token Contract Address | Your contract address from deployment |
| Token Symbol | MTK (or your chosen symbol) |
| Token Decimals | 18 |

**Step 4: Confirm**

Click **"Add Custom Token"** and then **"Import Tokens"**. Your token should now appear in your wallet with your balance.

### Adding to Trust Wallet

**Step 1: Open Trust Wallet**

Open the Trust Wallet app on your mobile device.

**Step 2: Go to Settings**

Tap the settings icon and select **"Add Custom Token"**.

**Step 3: Enter Network and Details**

- Select your network (Sepolia or Ethereum)
- Enter your contract address
- Token name, symbol, and decimals should auto-populate

**Step 4: Confirm**

Tap **"Add"** to add the token to your wallet.

### Sharing Your Token

To share your token with others:

1. Copy your contract address
2. Share it via QR code or direct link
3. Others can import it using the same process above

---

## 7. Setting Up Liquidity Pools on Uniswap

A liquidity pool allows users to trade your token for ETH (or other tokens). Without a liquidity pool, your token cannot be traded on decentralized exchanges.

### Understanding Liquidity Pools

A liquidity pool is a smart contract that holds equal values of two tokens (e.g., your token and ETH). When users trade, they exchange one token for another at a rate determined by the pool's ratio.

**Key Concepts:**

- **Liquidity Provider (LP)**: You deposit your tokens and ETH into the pool
- **LP Tokens**: You receive LP tokens representing your share of the pool
- **Slippage**: The difference between expected and actual price due to pool size
- **Fees**: Traders pay a 0.3% fee that goes to liquidity providers

### Setting Up on Sepolia (Testnet)

**Step 1: Get test ETH and tokens**

- Get test ETH from a faucet (see [Section 5](#5-running-deployment-on-sepolia-and-mainnet))
- You should already have your tokens from deployment

**Step 2: Visit Uniswap**

Go to [Uniswap Sepolia](https://app.uniswap.org/?chain=sepolia)

**Step 3: Connect Wallet**

Click **"Connect Wallet"** and select MetaMask. Approve the connection.

**Step 4: Create Pool**

1. Click **"Pools"** → **"Create a pool"**
2. Select your token and WETH (wrapped ETH)
3. Set the fee tier (0.3% is standard)
4. Set the initial price and liquidity amount
5. Click **"Create"** and approve the transaction

**Step 5: Add Liquidity**

After creating the pool, you can add more liquidity by:

1. Going to **"Pools"** → **"Your liquidity"**
2. Clicking your pool
3. Clicking **"Add liquidity"**
4. Entering the amount of tokens and ETH
5. Clicking **"Supply"** and approving the transaction

### Setting Up on Mainnet (Production)

The process is identical, but with important considerations:

**Before creating a mainnet pool:**

- Ensure you have sufficient ETH for gas fees (0.05-0.2 ETH)
- Ensure you have sufficient tokens and ETH for liquidity
- Consider the initial price carefully — it will determine the token's market value
- Start with a reasonable amount of liquidity to avoid extreme slippage

**Step 1: Visit Uniswap Mainnet**

Go to [Uniswap Mainnet](https://app.uniswap.org/?chain=ethereum)

**Step 2-5: Follow the same steps as Sepolia**

The interface is identical; only the network and real funds differ.

### Calculating Initial Price

The initial price is determined by the ratio of tokens to ETH you provide:

```
Price per token = ETH amount / Token amount

Example:
- You provide 10 ETH and 1,000,000 tokens
- Price per token = 10 / 1,000,000 = 0.00001 ETH
- In USD (assuming 1 ETH = $2,000): 0.00001 * $2,000 = $0.02 per token
```

Choose a price that reflects your token's perceived value and market conditions.

---

## 8. Safety Considerations: Testnet vs. Mainnet

### Sepolia Testnet

**Purpose:** Experimentation, learning, and testing before production deployment.

**Key Characteristics:**

- Test ETH has no real value and can be obtained for free from faucets
- All transactions are reversible (in theory, for testing purposes)
- Low gas fees due to low network usage
- Perfect for learning and making mistakes
- No real financial risk

**Best Practices on Sepolia:**

- Test all contract functions thoroughly
- Experiment with different token configurations
- Practice the deployment process multiple times
- Test wallet integrations and liquidity pools
- Simulate real-world scenarios (large transfers, edge cases)

### Ethereum Mainnet

**Purpose:** Production deployment with real value and permanent transactions.

**Key Characteristics:**

- Real ETH required for gas fees
- All transactions are permanent and irreversible
- Higher gas fees due to network congestion
- Subject to real market forces and trading
- Financial risk if contract has bugs or security vulnerabilities

**Critical Requirements Before Mainnet Deployment:**

| Requirement | Why It Matters |
|-------------|----------------|
| Contract audited | Identifies security vulnerabilities before real funds are at risk |
| Thoroughly tested on Sepolia | Catches bugs before they affect real users |
| Sufficient ETH for gas | Deployment will fail if you run out of ETH mid-transaction |
| Private key secured | Anyone with your private key can steal your funds |
| Liquidity planned | Without liquidity, your token cannot be traded |
| Community informed | Users should know about your token before launch |

### Security Best Practices

**Private Key Management:**

- Never share your private key with anyone
- Never commit your private key to version control
- Use environment variables (.env file) to store sensitive data
- Consider using a hardware wallet (Ledger, Trezor) for mainnet
- For large deployments, use a multi-signature wallet

**Contract Security:**

- Use well-tested libraries like OpenZeppelin
- Keep contracts simple and focused
- Have your contract audited by a professional security firm
- Test edge cases and error conditions
- Monitor for unusual activity after deployment

**Operational Security:**

- Deploy from a secure computer with up-to-date software
- Verify contract addresses before sending funds
- Double-check all configuration before deployment
- Keep deployment records and backups
- Monitor your contract on Etherscan for suspicious activity

### Common Mistakes to Avoid

| Mistake | Consequence | Prevention |
|---------|-------------|-----------|
| Deploying to mainnet without testing | Bugs affect real users and funds | Test thoroughly on Sepolia first |
| Sharing private key | Funds can be stolen | Never share your private key |
| Insufficient gas | Deployment fails mid-transaction | Check balance before deploying |
| Wrong network selected | Tokens deployed to wrong chain | Verify network before deployment |
| No liquidity pool | Token cannot be traded | Create liquidity pool before launch |
| Unverified contract | Users cannot audit code | Verify contract on Etherscan |

---

## Troubleshooting

### Common Issues and Solutions

**Issue: "Error: insufficient funds for gas"**

**Solution:** Ensure your account has enough ETH for gas fees. Get test ETH from a faucet for Sepolia, or transfer real ETH to your wallet for mainnet.

**Issue: "Error: invalid private key"**

**Solution:** Verify your private key in `.env` is correct and doesn't include the "0x" prefix. Check that the key is from the account you want to use.

**Issue: "Contract address is undefined"**

**Solution:** Ensure the contract deployed successfully. Check the deployment output for error messages. Verify your contract compiles without errors using `npx hardhat compile`.

**Issue: "MetaMask cannot find the token"**

**Solution:** Verify the contract address is correct. Ensure you're on the correct network (Sepolia or Mainnet). Try adding the token manually by contract address.

**Issue: "Uniswap says 'Insufficient liquidity'"**

**Solution:** Create a liquidity pool first. You need to provide both your token and ETH to the pool before trading is possible.

---

## Next Steps

After successfully deploying your token, consider:

1. **Marketing:** Announce your token to potential users and investors
2. **Community:** Build a community around your token (Discord, Twitter, etc.)
3. **Auditing:** Have your contract professionally audited for security
4. **Governance:** Implement governance mechanisms if needed
5. **Additional Features:** Add staking, vesting, or other advanced features
6. **Integration:** List your token on exchanges and aggregators

---

## Resources

- **Hardhat Documentation:** https://hardhat.org/docs
- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts/
- **Ethereum Development:** https://ethereum.org/en/developers/
- **Solidity Documentation:** https://docs.soliditylang.org/
- **Etherscan:** https://etherscan.io/ (view and verify contracts)
- **Uniswap Documentation:** https://docs.uniswap.org/

---

## License

This guide and associated code are provided under the MIT License. Use at your own risk and ensure you understand the implications of deploying smart contracts on public blockchains.

---

**Last Updated:** May 2026  
**Version:** 1.0.0
