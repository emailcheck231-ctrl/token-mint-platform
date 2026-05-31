/**
 * Gas Fee Estimator Utility
 * 
 * Provides functions to fetch real-time gas prices and estimate deployment costs
 * for ERC-20 token contracts on Sepolia testnet and Ethereum mainnet.
 */

export interface GasPrice {
  standard: string; // in gwei
  fast: string; // in gwei
  urgent: string; // in gwei
  timestamp: number;
}

export interface GasEstimate {
  network: "sepolia" | "mainnet";
  gasPrice: GasPrice;
  estimatedGas: number; // typical gas for contract deployment
  estimatedCostEth: {
    standard: string;
    fast: string;
    urgent: string;
  };
  estimatedCostUsd: {
    standard: string;
    fast: string;
    urgent: string;
  };
  ethPrice: number; // current ETH price in USD
  timestamp: number;
}

/**
 * Typical gas costs for ERC-20 deployment
 * These are estimates based on MyToken.sol with OpenZeppelin contracts
 */
const DEPLOYMENT_GAS_ESTIMATES = {
  sepolia: 1200000, // ~1.2M gas for full contract with imports
  mainnet: 1200000,
};

/**
 * Fetch current gas prices from Etherscan API
 * Falls back to default values if API is unavailable
 */
export async function fetchGasPrices(network: "sepolia" | "mainnet"): Promise<GasPrice> {
  try {
    const apiUrl =
      network === "sepolia"
        ? "https://api-sepolia.etherscan.io/api?module=gastracker&action=gasoracle"
        : "https://api.etherscan.io/api?module=gastracker&action=gasoracle";

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "1" && data.result) {
      return {
        standard: data.result.SafeGasPrice,
        fast: data.result.ProposeGasPrice,
        urgent: data.result.FastGasPrice,
        timestamp: Date.now(),
      };
    }

    // Fallback to default values
    return getDefaultGasPrices(network);
  } catch (error) {
    console.error("Failed to fetch gas prices:", error);
    return getDefaultGasPrices(network);
  }
}

/**
 * Get default gas prices when API is unavailable
 * These are typical values based on network conditions
 */
function getDefaultGasPrices(network: "sepolia" | "mainnet"): GasPrice {
  // Sepolia typically has lower gas prices than mainnet
  if (network === "sepolia") {
    return {
      standard: "20",
      fast: "25",
      urgent: "30",
      timestamp: Date.now(),
    };
  }

  // Mainnet typical prices (can vary significantly)
  return {
    standard: "30",
    fast: "50",
    urgent: "100",
    timestamp: Date.now(),
  };
}

/**
 * Fetch current ETH price in USD
 * Uses CoinGecko free API (no authentication required)
 */
export async function fetchEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();

    if (data.ethereum && data.ethereum.usd) {
      return data.ethereum.usd;
    }

    // Fallback to approximate value
    return 2000;
  } catch (error) {
    console.error("Failed to fetch ETH price:", error);
    // Return reasonable fallback value
    return 2000;
  }
}

/**
 * Calculate estimated deployment cost
 * Returns cost in both ETH and USD for different gas price tiers
 */
export async function estimateDeploymentCost(
  network: "sepolia" | "mainnet"
): Promise<GasEstimate> {
  const [gasPrices, ethPrice] = await Promise.all([fetchGasPrices(network), fetchEthPrice()]);

  const estimatedGas = DEPLOYMENT_GAS_ESTIMATES[network];

  // Convert gwei to ETH (1 gwei = 1e-9 ETH)
  const calculateCostEth = (gasPriceGwei: string): string => {
    const gasPrice = parseFloat(gasPriceGwei);
    const costEth = (gasPrice * estimatedGas) / 1e9;
    return costEth.toFixed(6);
  };

  // Calculate USD cost
  const calculateCostUsd = (costEth: string): string => {
    const usdCost = parseFloat(costEth) * ethPrice;
    return usdCost.toFixed(2);
  };

  const costEthStandard = calculateCostEth(gasPrices.standard);
  const costEthFast = calculateCostEth(gasPrices.fast);
  const costEthUrgent = calculateCostEth(gasPrices.urgent);

  return {
    network,
    gasPrice: gasPrices,
    estimatedGas,
    estimatedCostEth: {
      standard: costEthStandard,
      fast: costEthFast,
      urgent: costEthUrgent,
    },
    estimatedCostUsd: {
      standard: calculateCostUsd(costEthStandard),
      fast: calculateCostUsd(costEthFast),
      urgent: calculateCostUsd(costEthUrgent),
    },
    ethPrice,
    timestamp: Date.now(),
  };
}

/**
 * Compare deployment costs between Sepolia and Mainnet
 */
export async function compareDeploymentCosts(): Promise<{
  sepolia: GasEstimate;
  mainnet: GasEstimate;
}> {
  const [sepoliaEstimate, mainnetEstimate] = await Promise.all([
    estimateDeploymentCost("sepolia"),
    estimateDeploymentCost("mainnet"),
  ]);

  return {
    sepolia: sepoliaEstimate,
    mainnet: mainnetEstimate,
  };
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gasPriceGwei: string): string {
  return `${parseFloat(gasPriceGwei).toFixed(1)} Gwei`;
}

/**
 * Format ETH amount for display
 */
export function formatEth(ethAmount: string): string {
  const amount = parseFloat(ethAmount);
  if (amount < 0.0001) {
    return `${(amount * 1e6).toFixed(2)} µETH`;
  }
  return `${amount.toFixed(6)} ETH`;
}

/**
 * Format USD amount for display
 */
export function formatUsd(usdAmount: string): string {
  return `$${parseFloat(usdAmount).toFixed(2)}`;
}

/**
 * Get gas speed recommendation based on urgency
 */
export function getSpeedRecommendation(
  speed: "standard" | "fast" | "urgent"
): { label: string; description: string; time: string } {
  const recommendations = {
    standard: {
      label: "Standard",
      description: "Slower but cheaper. Good for non-urgent deployments.",
      time: "5-30 minutes",
    },
    fast: {
      label: "Fast",
      description: "Balanced speed and cost. Recommended for most deployments.",
      time: "1-5 minutes",
    },
    urgent: {
      label: "Urgent",
      description: "Fastest but most expensive. Use only if needed immediately.",
      time: "< 1 minute",
    },
  };

  return recommendations[speed];
}

/**
 * Check if deployment cost is within reasonable bounds
 * Returns warning if cost seems unusually high
 */
export function getDeploymentWarning(estimate: GasEstimate): string | null {
  const standardCost = parseFloat(estimate.estimatedCostEth.standard);
  const urgentCost = parseFloat(estimate.estimatedCostEth.urgent);

  // Warn if urgent cost exceeds 1 ETH
  if (urgentCost > 1) {
    return `⚠️ Urgent gas price is unusually high (${formatEth(estimate.estimatedCostEth.urgent)}). Consider waiting for lower gas prices.`;
  }

  // Warn if standard cost exceeds 0.5 ETH
  if (standardCost > 0.5) {
    return `⚠️ Gas prices are elevated. Standard cost is ${formatEth(estimate.estimatedCostEth.standard)}.`;
  }

  return null;
}
