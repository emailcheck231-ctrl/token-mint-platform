# Crypto Import & Token Workflow Guide

## Quick Start for Users
1. Click "Import Crypto Wallet" button on home page
2. Select import method (Seed Phrase, Private Key, or Public Key)
3. Choose network (Ethereum Mainnet or Sepolia Testnet)
4. Enter your crypto data
5. Click "Import Wallet"
6. ✅ Wallet connected, mint plugin ready to use

## API Reference

### importWallet - Import a new wallet
```typescript
const result = await trpc.crypto.importWallet.mutateAsync({
  publicKey: "0x1234...",  // wallet address
  chain: "sepolia",        // ethereum or sepolia
  importMethod: "privateKey", // seedPhrase | privateKey | publicKey
  metadata: { source: "import" }
});
// Returns: { success: boolean, wallet: CryptoWallet }
```

### getWallet - Check if wallet is connected
```typescript
const { data: wallet } = trpc.crypto.getWallet.useQuery();
// Returns: CryptoWallet | null
```

### reflectToken - Add a token to wallet
```typescript
const result = await trpc.crypto.reflectToken.mutateAsync({
  walletId: wallet.id,
  contractAddress: "0xA0b86991...", // ERC-20 address
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6
});
// Returns: { success: boolean, token: TokenReflection }
```

### getTokens - Get all tokens in wallet
```typescript
const { data: tokens } = trpc.crypto.getTokens.useQuery({ 
  walletId: wallet.id 
});
// Returns: TokenReflection[]
```

### mintToken - Mint tokens to wallet
```typescript
const result = await trpc.crypto.mintToken.mutateAsync({
  walletId: wallet.id,
  tokenContractAddress: "0xA0b86991...",
  amount: "1000000000",
  chainId: 11155111 // Sepolia
});
// Returns: { success: boolean, transactionHash: string }
```

### transferToken - Transfer tokens between wallets
```typescript
const result = await trpc.crypto.transferToken.mutateAsync({
  fromWalletId: wallet.id,
  toAddress: "0x742d35Cc...",
  tokenContractAddress: "0xA0b86991...",
  amount: "500000000",
  chainId: 11155111
});
// Returns: { success: boolean, transactionHash: string }
```

## Complete Workflow Example

```typescript
// 1. User imports wallet
const walletResult = await importWallet.mutateAsync({
  publicKey: myAddress,
  chain: "sepolia",
  importMethod: "privateKey"
});

const walletId = walletResult.wallet.id;

// 2. Check wallet status
const wallet = await getWallet.useQuery();
console.log(`Connected: ${wallet?.publicKey}`);

// 3. Add token to wallet
await reflectToken.mutateAsync({
  walletId,
  contractAddress: usdcAddress,
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6
});

// 4. Get tokens
const tokens = await getTokens.useQuery({ walletId });

// 5. Mint tokens
const mintTx = await mintToken.mutateAsync({
  walletId,
  tokenContractAddress: usdcAddress,
  amount: "1000000000"
});

// 6. Transfer tokens
const transferTx = await transferToken.mutateAsync({
  fromWalletId: walletId,
  toAddress: recipientAddress,
  tokenContractAddress: usdcAddress,
  amount: "500000000"
});
```

## Data Models

### CryptoWallet
- `id`: Unique identifier
- `openId`: User identifier (from OAuth)
- `publicKey`: Wallet address/key (unique)
- `chain`: Network (ethereum, sepolia)
- `importMethod`: How it was imported
- `isConnected`: Connection status
- `metadata`: Additional data (JSON)
- `createdAt`, `updatedAt`: Timestamps

### TokenReflection
- `id`: Unique identifier
- `walletId`: Reference to wallet
- `contractAddress`: ERC-20 contract
- `symbol`: Token ticker (USDC, DAI, etc)
- `name`: Full token name
- `decimals`: Precision level
- `totalSupply`: Total supply amount
- `isReflected`: Active status
- `metadata`: Additional data (JSON)
- `createdAt`, `updatedAt`: Timestamps

---

See IMPLEMENTATION_REPORT.md for technical details.
