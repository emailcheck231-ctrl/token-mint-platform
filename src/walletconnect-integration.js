// WalletConnect Integration
// This script initializes WalletConnect and automates token imports.

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

// Check if connection already exists
if (!connector.connected) {
  // create a new session
  connector.createSession();
}

// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
  console.log("Connected:", accounts, "Chain Id:", chainId);
});

// Token Import Example
export const importToken = (token) => {
  if (!connector.connected) {
    console.error("Please connect to a wallet first.");
    return;
  }

  // Example token import payload
  const customRequest = {
    method: "wallet_addEthereumChain", // or a method supported by Trust Wallet
    params: [
      {
        chainId: "0x1", // Ethereum Mainnet
        token: {
          address: token.contractAddress,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoURL, // URL to a hosted logo file
        },
      },
    ],
  };

  connector
    .sendCustomRequest(customRequest)
    .then((result) => {
      console.log("Token Imported Successfully:", result);
    })
    .catch((error) => {
      console.error("Error importing token:", error);
    });
};