# Gas Fee Estimator Guide

## Overview

The Gas Fee Estimator is a built-in feature of the TokenMint platform that helps developers understand and predict the cost of deploying ERC-20 tokens on both Sepolia testnet and Ethereum mainnet. This guide explains how to use the estimator and understand gas fees.

## What Are Gas Fees?

Gas fees are the cost required to execute transactions on the Ethereum blockchain. Every operation on Ethereum consumes a certain amount of "gas," and miners/validators charge a fee per unit of gas to process transactions.

**Key Concepts:**

- **Gas**: A unit of computational work (e.g., deploying a contract costs ~1.2 million gas)
- **Gas Price**: The price per unit of gas, measured in Gwei (1 Gwei = 0.000000001 ETH)
- **Gas Fee**: Total cost = Gas Used × Gas Price

**Example:**
```
Gas Used: 1,200,000
Gas Price: 30 Gwei
Total Fee: 1,200,000 × 30 Gwei = 36,000,000 Gwei = 0.036 ETH
```

## Accessing the Gas Estimator

The Gas Estimator is accessible in three ways:

1. **Tab Navigation**: Tap the "Gas" tab at the bottom of the app
2. **Home Screen**: Tap the "Estimate Gas Fees" card on the home screen
3. **Deploy Screen**: (Coming soon) Quick gas estimate before deployment

## Using the Gas Estimator

### Step 1: Select Your Network

Choose between two networks:

- **Sepolia (Testnet)**: For experimentation with free test ETH
- **Mainnet (Production)**: For real deployments with real ETH

### Step 2: Review Gas Prices

The estimator displays three gas price tiers:

| Tier | Speed | Use Case |
|------|-------|----------|
| **Standard** | 5-30 minutes | Non-urgent deployments, cost-conscious |
| **Fast** | 1-5 minutes | Recommended for most deployments |
| **Urgent** | < 1 minute | Time-critical deployments |

### Step 3: Understand the Costs

For each tier, you'll see:

- **Gas Price**: The current price per unit of gas (in Gwei)
- **Cost in ETH**: The estimated deployment cost in Ethereum
- **Cost in USD**: The estimated cost converted to US dollars

### Step 4: Compare Networks

The estimator shows a side-by-side comparison of costs between Sepolia and Mainnet. This helps you understand:

- How much more expensive mainnet deployment is
- Whether gas prices are unusually high
- The percentage difference between networks

## Understanding Gas Price Fluctuations

Gas prices on Ethereum fluctuate based on network demand. Here's what affects gas prices:

**Factors That Increase Gas Prices:**

- High network congestion (many users transacting)
- Popular NFT drops or token launches
- Market volatility and trading activity
- Time of day (peak hours typically have higher fees)

**Factors That Decrease Gas Prices:**

- Low network activity
- Off-peak hours (early morning UTC)
- Weekends (typically lower activity)
- Post-upgrade improvements to Ethereum

## Gas Price Recommendations

### When to Use Each Tier

**Standard (Cheapest)**

- Best for: Non-urgent deployments, testing
- Time: 5-30 minutes
- Cost: Lowest
- Risk: May take longer during congestion

**Fast (Recommended)**

- Best for: Most production deployments
- Time: 1-5 minutes
- Cost: Moderate
- Risk: Balanced speed and cost

**Urgent (Most Expensive)**

- Best for: Time-critical deployments only
- Time: < 1 minute
- Cost: Highest
- Risk: Expensive if gas prices spike

### Cost Optimization Tips

1. **Deploy During Off-Peak Hours**: Gas prices are typically lower early morning UTC (4-8 AM)
2. **Monitor Network Activity**: Check Etherscan's gas tracker before deploying
3. **Use Standard for Testing**: Test deployments on Sepolia first to save costs
4. **Batch Operations**: If possible, deploy multiple tokens in one transaction
5. **Wait for Lower Prices**: If prices are high, consider waiting 1-2 hours for prices to drop

## Sepolia vs. Mainnet

### Sepolia Testnet

**Characteristics:**

- Test ETH is free (obtained from faucets)
- No real financial risk
- Lower gas prices (typically 20-30 Gwei)
- Perfect for learning and testing

**When to Use:**

- Learning how to deploy
- Testing contract functionality
- Practicing wallet integration
- Experimenting with liquidity pools

**Cost:** Essentially free (test ETH has no value)

### Ethereum Mainnet

**Characteristics:**

- Real ETH required (costs real money)
- All transactions are permanent
- Higher gas prices (typically 30-100+ Gwei)
- Subject to market demand

**When to Use:**

- Production deployment with real value
- Launching a token for trading
- Creating liquidity pools with real funds
- After thorough testing on Sepolia

**Cost:** Real money (typically $50-500+ depending on gas prices)

## Interpreting Gas Estimates

### What the Estimator Shows

The estimator provides:

1. **Current ETH Price**: Today's ETH/USD exchange rate
2. **Estimated Gas**: Typical gas cost for MyToken.sol deployment (~1.2M gas)
3. **Network Comparison**: Side-by-side cost comparison

### Accuracy Limitations

The estimates are based on:

- **Current gas prices**: Updated in real-time from Etherscan API
- **Standard contract size**: Based on MyToken.sol with OpenZeppelin
- **Current ETH price**: From CoinGecko API

**Important:** Actual costs may vary due to:

- Network congestion changes
- ETH price volatility
- Custom contract modifications (larger contracts cost more)
- Transaction timing

## Gas Price Sources

The estimator fetches data from:

| Source | Data | Update Frequency |
|--------|------|------------------|
| **Etherscan API** | Gas prices (Gwei) | Real-time |
| **CoinGecko API** | ETH/USD price | Real-time |

Both APIs are free and widely used by the Ethereum community.

## Common Questions

### Q: Why are gas prices so high?

**A:** Gas prices fluctuate based on network demand. High prices typically occur during:
- Market volatility
- Popular NFT launches
- Peak trading hours
- Network congestion

Wait 1-2 hours for prices to drop, or check back during off-peak hours.

### Q: Can I deploy for free?

**A:** Yes, on Sepolia testnet! You can get free test ETH from faucets and deploy without spending real money. This is perfect for learning.

### Q: What if gas prices spike after I start deployment?

**A:** Your transaction is locked at the gas price you submitted. If prices spike after you submit, you won't be affected. If prices drop, you'll pay more than necessary (but it's already submitted).

### Q: How do I know if my estimate is accurate?

**A:** The estimate is based on the current network state. For the most accurate estimate:
1. Check the timestamp (should be recent)
2. Compare with Etherscan's gas tracker
3. Account for potential price changes during deployment

### Q: Should I always use "Fast"?

**A:** For most deployments, yes. "Fast" balances speed and cost. Use "Standard" if you're not in a hurry, and "Urgent" only if you absolutely need immediate confirmation.

## Next Steps

After using the Gas Estimator:

1. **Decide on Network**: Choose Sepolia for testing or Mainnet for production
2. **Select Gas Tier**: Choose Standard, Fast, or Urgent based on your needs
3. **Prepare Funds**: Ensure you have sufficient ETH in your wallet
4. **Deploy**: Follow the deployment instructions in the Deploy screen
5. **Monitor**: Track your transaction on Etherscan

## Resources

- **Etherscan Gas Tracker**: https://etherscan.io/gastracker
- **Ethereum Gas Explained**: https://ethereum.org/en/developers/docs/gas/
- **Gas Optimization Tips**: https://docs.openzeppelin.com/contracts/4.x/gas-optimization
- **Real-time Gas Prices**: https://www.gasnow.org/

## Support

For questions or issues with the Gas Estimator:

1. Check this guide for common questions
2. Review the main README.md for platform overview
3. Check Etherscan's gas tracker for network-wide information
4. Monitor the app for error messages or warnings

---

**Last Updated:** May 2026  
**Version:** 1.0.0
