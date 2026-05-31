# TokenMint: Developer Platform for ERC-20 Token Creation

TokenMint is a comprehensive developer platform that guides you through creating, deploying, and managing ERC-20 tokens on Ethereum. The platform combines a mobile app interface with detailed technical documentation, making it accessible for developers of all experience levels.

## 🎯 What is TokenMint?

TokenMint simplifies the entire process of launching an ERC-20 token on Ethereum. Whether you're experimenting on the Sepolia testnet or deploying to production on Ethereum mainnet, TokenMint provides step-by-step guidance, safety warnings, and best practices.

**Key Features:**

- **Interactive Mobile App**: Browse and manage token projects with an intuitive interface
- **Project Management**: Create, organize, and track multiple token projects
- **Deployment Guidance**: Step-by-step instructions for Sepolia testnet and Ethereum mainnet
- **Wallet Integration**: Add tokens to MetaMask or Trust Wallet with a single click
- **Liquidity Pool Setup**: Create Uniswap liquidity pools for token trading
- **Safety First**: Clear warnings about testnet vs. production, security best practices, and common pitfalls
- **Comprehensive Documentation**: Detailed guides covering all aspects of token deployment

## 🚀 Quick Start

### For Mobile App Users

1. **Download and Install**: Get TokenMint from the app store
2. **Create a Project**: Tap "Start New Project" and fill in token details
3. **Choose Network**: Select Sepolia (testnet) or Ethereum (mainnet)
4. **Deploy**: Follow the guided deployment instructions
5. **Add to Wallet**: Easily add your token to MetaMask or Trust Wallet
6. **Create Liquidity**: Set up a Uniswap pool for trading

### For Developers (Hardhat Setup)

```bash
# Clone or download the project
cd token-mint-platform/hardhat-project

# Install dependencies
npm install

# Create .env file with your RPC URLs and private key
cp .env.example .env
# Edit .env with your configuration

# Compile the contract
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Ethereum mainnet (after testing on Sepolia)
npm run deploy:mainnet
```

## 📱 Mobile App Architecture

The TokenMint mobile app is built with React Native and Expo, providing a smooth, native-like experience on iOS, Android, and web.

### Screen Overview

| Screen | Purpose |
|--------|---------|
| **Home** | Main entry point with quick actions and platform overview |
| **Projects** | Browse and manage all your token projects |
| **Project Detail** | View and manage a specific token (tabs: Overview, Contract, Deploy, Wallet, Liquidity) |
| **Contract Editor** | View the ERC-20 contract code with syntax highlighting |
| **Deploy** | Configure and execute deployment with safety checks |
| **Wallet Integration** | Add tokens to MetaMask or Trust Wallet |
| **Liquidity Pool** | Create and manage Uniswap liquidity pools |
| **Settings** | Configure RPC URLs, private keys, and app preferences |

### Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + AsyncStorage
- **Backend**: Express.js with Drizzle ORM (optional, for advanced features)
- **Smart Contracts**: Solidity with Hardhat and OpenZeppelin

## 🔗 Hardhat Project Structure

The `hardhat-project/` directory contains everything needed for contract development and deployment:

```
hardhat-project/
├── contracts/
│   └── MyToken.sol          # ERC-20 token contract
├── scripts/
│   └── deploy.js            # Deployment script
├── hardhat.config.js        # Hardhat configuration
├── package.json             # Dependencies
└── .env.example             # Environment template
```

## 📚 Comprehensive Guides

### 1. Project Setup with Hardhat and Replit

Learn how to set up a Hardhat project locally or in Replit, a browser-based development environment. This section covers:

- Creating a new Hardhat project
- Installing dependencies
- Project structure overview
- Local vs. Replit setup

**Read the full guide:** See [HARDHAT_README.md - Section 1](./HARDHAT_README.md#1-project-setup-with-hardhat-and-replit)

### 2. Writing a Simple ERC-20 Contract

Understand the ERC-20 standard and learn how to write a production-ready token contract using OpenZeppelin. This section covers:

- ERC-20 standard overview and key functions
- MyToken.sol contract implementation
- Contract features (burnable, pausable, ownable)
- Calculating initial supply

**Read the full guide:** See [HARDHAT_README.md - Section 2](./HARDHAT_README.md#2-writing-a-simple-erc-20-contract)

### 3. Configuring Hardhat with Network RPC URLs

Set up Hardhat to connect to Sepolia testnet and Ethereum mainnet. This section covers:

- Obtaining free RPC URLs from Infura, Alchemy, QuickNode
- Creating and securing .env file
- Configuring hardhat.config.js
- Understanding network configuration

**Read the full guide:** See [HARDHAT_README.md - Section 3](./HARDHAT_README.md#3-configuring-hardhat-with-network-rpc-urls)

### 4. Creating a Deployment Script

Learn how to automate the deployment process with a comprehensive script. This section covers:

- Deployment script overview
- Checking account balance and network info
- Deploying the contract
- Displaying deployment results

**Read the full guide:** See [HARDHAT_README.md - Section 4](./HARDHAT_README.md#4-creating-a-deployment-script)

### 5. Running Deployment on Sepolia and Mainnet

Execute your deployment on both testnet and production networks. This section covers:

- Compiling the contract
- Deploying to Sepolia testnet
- Getting test ETH from faucets
- Deploying to Ethereum mainnet
- Verifying contracts on Etherscan

**Read the full guide:** See [HARDHAT_README.md - Section 5](./HARDHAT_README.md#5-running-deployment-on-sepolia-and-mainnet)

### 6. Adding Tokens to MetaMask or Trust Wallet

Enable users to import your token into their wallets. This section covers:

- Adding tokens to MetaMask
- Adding tokens to Trust Wallet
- Sharing token contract addresses
- QR code generation for easy sharing

**Read the full guide:** See [HARDHAT_README.md - Section 6](./HARDHAT_README.md#6-adding-tokens-to-metamask-or-trust-wallet)

### 7. Setting Up Liquidity Pools on Uniswap

Create liquidity pools to enable token trading. This section covers:

- Understanding liquidity pools and LP tokens
- Setting up pools on Sepolia testnet
- Setting up pools on Ethereum mainnet
- Calculating initial token price
- Managing liquidity

**Read the full guide:** See [HARDHAT_README.md - Section 7](./HARDHAT_README.md#7-setting-up-liquidity-pools-on-uniswap)

### 8. Safety Considerations: Testnet vs. Mainnet

Learn critical safety practices and best practices for each environment. This section covers:

- Sepolia testnet characteristics and best practices
- Ethereum mainnet requirements and warnings
- Security best practices for private keys
- Contract security considerations
- Common mistakes to avoid

**Read the full guide:** See [HARDHAT_README.md - Section 8](./HARDHAT_README.md#8-safety-considerations-testnet-vs-mainnet)

## 🔐 Security & Best Practices

### Sepolia Testnet (For Learning & Experimentation)

The Sepolia testnet is designed for developers to experiment without financial risk. Test ETH is free and has no real value. Use Sepolia to:

- Learn the deployment process
- Test contract functionality
- Practice wallet integrations
- Experiment with liquidity pools
- Make mistakes and learn from them

**Sepolia Characteristics:**

- Test ETH obtained for free from faucets
- All transactions are reversible (in theory)
- Low gas fees due to low network usage
- Perfect for learning and testing
- No real financial risk

### Ethereum Mainnet (For Production)

Ethereum mainnet is where your token has real value and can be traded for real money. Before deploying to mainnet:

**Critical Requirements:**

- Contract has been thoroughly tested on Sepolia
- Contract has been audited by a security professional
- You have sufficient ETH to cover gas fees (typically 0.01-0.05 ETH)
- Your private key is secure and never shared
- You understand the implications of permanent deployment

**Mainnet Characteristics:**

- Real ETH required for gas fees
- All transactions are permanent and irreversible
- Higher gas fees due to network congestion
- Subject to real market forces
- Financial risk if contract has bugs

### Private Key Security

Your private key is the most sensitive piece of information. Protect it at all costs:

- **Never share** your private key with anyone
- **Never commit** your private key to version control
- **Use environment variables** (.env file) to store it
- **Consider hardware wallets** for mainnet deployments
- **Use multi-signature wallets** for large deployments
- **Rotate keys** if you suspect compromise

## 🛠️ Development

### Running the Mobile App

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# For iOS
npm run ios

# For Android
npm run android

# For web
npm run dev:metro
```

### Building for Production

```bash
# Create a checkpoint (required before publishing)
npm run checkpoint

# Publish to app stores via the Manus platform UI
# Click the "Publish" button in the management interface
```

### Running Tests

```bash
# Run unit tests
npm run test

# Run Hardhat contract tests
cd hardhat-project
npm run test
```

## 📖 Documentation

- **Mobile App Design**: See [design.md](./design.md) for detailed interface design specifications
- **Project TODO**: See [todo.md](./todo.md) for feature tracking and roadmap
- **Hardhat Guide**: See [HARDHAT_README.md](./HARDHAT_README.md) for comprehensive deployment guide
- **Expo Documentation**: See `/token-mint-platform_helper/docs/` for Expo SDK module documentation

## 🌐 Supported Networks

| Network | Chain ID | Purpose | RPC Provider |
|---------|----------|---------|--------------|
| Sepolia | 11155111 | Testnet (learning) | Infura, Alchemy, QuickNode |
| Ethereum | 1 | Mainnet (production) | Infura, Alchemy, QuickNode |

## 📦 Dependencies

### Mobile App

- **React Native 0.81**: Cross-platform mobile framework
- **Expo SDK 54**: Managed React Native framework
- **NativeWind 4**: Tailwind CSS for React Native
- **React Router 6**: Navigation and routing
- **AsyncStorage**: Local data persistence
- **TanStack Query**: Server state management

### Hardhat Project

- **Hardhat 2.19**: Ethereum development environment
- **Solidity 0.8.20**: Smart contract language
- **OpenZeppelin Contracts 5.0**: Battle-tested contract libraries
- **Ethers.js 6.10**: Ethereum JavaScript library
- **dotenv**: Environment variable management

## 🚨 Common Issues & Troubleshooting

**Issue: "Error: insufficient funds for gas"**

Ensure your account has enough ETH. Get test ETH from a faucet for Sepolia, or transfer real ETH for mainnet.

**Issue: "Contract address is undefined"**

Verify the deployment succeeded by checking the output. Ensure your contract compiles without errors using `npx hardhat compile`.

**Issue: "MetaMask cannot find the token"**

Verify the contract address is correct and you're on the correct network. Try adding the token manually.

**Issue: "Uniswap says 'Insufficient liquidity'"**

Create a liquidity pool first. You need to provide both your token and ETH to the pool.

For more troubleshooting, see [HARDHAT_README.md - Troubleshooting](./HARDHAT_README.md#troubleshooting).

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

TokenMint is built with:

- **OpenZeppelin Contracts**: Industry-standard smart contract libraries
- **Hardhat**: Ethereum development environment
- **Expo**: Managed React Native framework
- **Uniswap**: Decentralized exchange protocol
- **Etherscan**: Blockchain explorer and verification service

## 📞 Support & Feedback

For support, questions, or feedback:

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check [HARDHAT_README.md](./HARDHAT_README.md) for detailed guides
- **Community**: Join our community for discussions and help

## 🗺️ Roadmap

Future enhancements planned for TokenMint:

- Support for ERC-721 (NFT) contracts
- Custom contract templates and wizards
- Token analytics dashboard
- Integration with block explorers
- Real-time gas price estimation
- Multi-language support
- Community contract library
- Advanced features (staking, vesting, governance)

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Built with:** React Native, Hardhat, Solidity, OpenZeppelin

For the complete deployment guide, see [HARDHAT_README.md](./HARDHAT_README.md).
