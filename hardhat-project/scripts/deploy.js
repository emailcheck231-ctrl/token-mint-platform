/**
 * Deployment Script for MyToken ERC-20 Contract
 * 
 * This script deploys the MyToken contract to Sepolia testnet or Ethereum mainnet.
 * 
 * Usage:
 * - Deploy to Sepolia: npx hardhat run scripts/deploy.js --network sepolia
 * - Deploy to Mainnet: npx hardhat run scripts/deploy.js --network mainnet
 * 
 * Before running:
 * 1. Ensure .env file is configured with RPC URLs and private key
 * 2. Ensure you have sufficient ETH for gas fees
 * 3. For mainnet, ensure you have audited the contract
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting token deployment...\n");

  // Get the network information
  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;

  console.log(`📡 Network: ${network} (Chain ID: ${chainId})`);

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  console.log(`💰 Account balance: ${balanceInEth} ETH\n`);

  // Token configuration
  const TOKEN_NAME = "My Token";
  const TOKEN_SYMBOL = "MTK";
  const INITIAL_SUPPLY = hre.ethers.parseEther("1000000"); // 1,000,000 tokens with 18 decimals

  console.log("📋 Token Configuration:");
  console.log(`   Name: ${TOKEN_NAME}`);
  console.log(`   Symbol: ${TOKEN_SYMBOL}`);
  console.log(`   Initial Supply: ${hre.ethers.formatEther(INITIAL_SUPPLY)} ${TOKEN_SYMBOL}\n`);

  // Warn about mainnet deployment
  if (network === "mainnet") {
    console.log("⚠️  WARNING: You are deploying to ETHEREUM MAINNET!");
    console.log("   This will cost real ETH and is permanent.");
    console.log("   Ensure you have:");
    console.log("   - Audited the contract code");
    console.log("   - Tested on Sepolia first");
    console.log("   - Sufficient ETH for gas fees\n");
  } else if (network === "sepolia") {
    console.log("✅ Deploying to Sepolia Testnet (test network, no real value)\n");
  }

  // Deploy the contract
  console.log("🔨 Deploying MyToken contract...");
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL);

  // Wait for deployment to complete
  await myToken.waitForDeployment();
  const contractAddress = await myToken.getAddress();

  console.log(`✅ Contract deployed successfully!\n`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Block Explorer: ${getBlockExplorerUrl(network, contractAddress)}\n`);

  // Display token details
  const totalSupply = await myToken.totalSupply();
  const decimals = await myToken.decimals();
  const owner = await myToken.owner();

  console.log("📊 Token Details:");
  console.log(`   Total Supply: ${hre.ethers.formatEther(totalSupply)} ${TOKEN_SYMBOL}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(`   Owner: ${owner}\n`);

  // Save deployment info
  const deploymentInfo = {
    network: network,
    chainId: chainId,
    contractAddress: contractAddress,
    tokenName: TOKEN_NAME,
    tokenSymbol: TOKEN_SYMBOL,
    initialSupply: hre.ethers.formatEther(INITIAL_SUPPLY),
    decimals: decimals,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  console.log("💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require("fs");
  const deploymentFile = `deployments/${network}-deployment.json`;
  fs.mkdirSync("deployments", { recursive: true });
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n✅ Deployment info saved to ${deploymentFile}`);

  // Instructions for next steps
  console.log("\n📝 Next Steps:");
  console.log("1. Add token to MetaMask:");
  console.log(`   - Contract Address: ${contractAddress}`);
  console.log(`   - Symbol: ${TOKEN_SYMBOL}`);
  console.log(`   - Decimals: ${decimals}`);
  console.log("\n2. Create liquidity pool on Uniswap:");
  const uniswapUrl = getUniswapUrl(network);
  console.log(`   - Visit: ${uniswapUrl}`);
  console.log(`   - Add liquidity with ETH and your token`);
  console.log("\n3. Verify contract on block explorer (optional):");
  console.log(`   - Visit: ${getBlockExplorerUrl(network, contractAddress)}`);
  console.log(`   - Click 'Verify and Publish' to verify source code`);
}

/**
 * Get the block explorer URL for the contract
 */
function getBlockExplorerUrl(network, contractAddress) {
  if (network === "sepolia") {
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
  } else if (network === "mainnet") {
    return `https://etherscan.io/address/${contractAddress}`;
  }
  return contractAddress;
}

/**
 * Get the Uniswap URL for the network
 */
function getUniswapUrl(network) {
  if (network === "sepolia") {
    return "https://app.uniswap.org/?chain=sepolia";
  } else if (network === "mainnet") {
    return "https://app.uniswap.org/?chain=ethereum";
  }
  return "https://app.uniswap.org";
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
