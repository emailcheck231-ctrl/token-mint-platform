/**
 * Token project data types for TokenMint platform
 */

export type Network = "sepolia" | "mainnet";

export type ProjectStatus = "draft" | "deploying" | "deployed" | "active";

export interface TokenProject {
  id: string;
  name: string;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: string;
  decimals: number;
  network: Network;
  status: ProjectStatus;
  contractAddress?: string;
  contractCode: string;
  deploymentHash?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DeploymentConfig {
  rpcUrl: string;
  privateKey: string;
  network: Network;
}

export interface ContractDeploymentResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

export interface WalletIntegrationData {
  contractAddress: string;
  tokenSymbol: string;
  decimals: number;
  tokenName: string;
}

export interface LiquidityPoolData {
  network: Network;
  uniswapUrl: string;
  tokenAddress: string;
  ethAddress: string;
  initialPrice: string;
  liquidityAmount: string;
}
