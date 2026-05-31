# TokenMint Mobile App - Interface Design

## Overview

TokenMint is a developer-focused mobile platform that guides users through creating, deploying, and managing ERC-20 tokens on Ethereum. The app emphasizes clarity, step-by-step guidance, and safe separation between testnet (Sepolia) and mainnet (production) environments.

**Design Principles:**
- **Mobile-first**: Portrait orientation (9:16), optimized for one-handed usage
- **Developer-friendly**: Clear technical content, code snippets, and configuration guidance
- **Safety-conscious**: Prominent warnings for mainnet operations, clear testnet vs. production distinction
- **Apple HIG-aligned**: Follows iOS design standards with clean typography, proper spacing, and native interactions

---

## Screen List

### 1. **Home Screen** (Tab: Home)
Main entry point showing platform overview and quick actions.

**Content:**
- Header: "TokenMint" with app icon
- Hero section: "Create & Deploy ERC-20 Tokens"
- Three quick-action cards:
  - "Start New Project" (primary button)
  - "View My Tokens" (secondary button)
  - "Learn Hardhat" (tertiary button)
- Recent activity section (if any projects exist)
- Bottom navigation with three tabs: Home, Projects, Settings

---

### 2. **Projects List Screen** (Tab: Projects)
Browse and manage all token projects.

**Content:**
- Header: "My Projects"
- Search/filter bar
- Project cards in a list, each showing:
  - Project name
  - Token symbol
  - Network (Sepolia badge or Mainnet badge with color coding)
  - Status (Draft, Deployed, Active)
  - Tap to view details
- Empty state with "Create your first project" button if no projects exist

---

### 3. **Project Setup Wizard** (Multi-step flow)
Step-by-step guide for creating a new token project.

**Step 1: Basic Info**
- Project name input
- Token name input
- Token symbol input (max 10 chars)
- Initial supply input
- Decimals selector (default 18)
- "Next" button

**Step 2: Network Selection**
- Radio buttons: "Sepolia (Testnet)" vs. "Ethereum (Mainnet)"
- Description of each network (costs, permanence, testing vs. production)
- Warning banner for Mainnet selection
- "Next" button

**Step 3: Review & Confirm**
- Summary of all settings
- "Create Project" button
- "Back" button to edit

---

### 4. **Project Detail Screen**
View and manage a specific token project.

**Content:**
- Header with project name and network badge
- Tabs: Overview | Contract | Deploy | Wallet | Liquidity
- **Overview Tab:**
  - Token details (name, symbol, supply, decimals)
  - Network and status
  - Contract address (if deployed)
  - Copy-to-clipboard button for contract address
  - Edit button (for draft projects only)

---

### 5. **Contract Editor Screen**
View and customize the ERC-20 contract code.

**Content:**
- Header: "Contract Code"
- Read-only code viewer showing MyToken.sol
- Syntax highlighting for Solidity
- "Copy Contract" button
- "View on GitHub" link
- Info section explaining contract features (standard ERC-20, burnable, mintable, etc.)

---

### 6. **Deploy Screen**
Configure and execute deployment to Sepolia or Mainnet.

**Content:**
- Header: "Deploy Token"
- Network indicator (Sepolia or Mainnet with color coding)
- **Warning banner** (prominent for Mainnet):
  - "⚠️ Mainnet deployment is permanent and costs real ETH"
  - "Ensure you have audited the contract and have sufficient funds"
- Prerequisites checklist:
  - [ ] Hardhat project set up
  - [ ] .env file configured with RPC URL and private key
  - [ ] Sufficient ETH for gas fees
- Deployment command display (copy-to-clipboard):
  - `npx hardhat run scripts/deploy.js --network sepolia` (or mainnet)
- Status indicator (Ready to Deploy / Deploying / Deployed)
- "Deploy Now" button (opens instructions or external deployment guide)
- Deployment history section (if applicable)

---

### 7. **Wallet Integration Screen**
Guide for adding deployed token to MetaMask or Trust Wallet.

**Content:**
- Header: "Add to Wallet"
- Network indicator
- **Token Details Card:**
  - Contract address (with copy button)
  - Token symbol
  - Decimals
- Step-by-step instructions:
  1. Open MetaMask/Trust Wallet
  2. Go to "Import Token" or "Add Custom Token"
  3. Paste contract address
  4. Symbol and decimals auto-fill
  5. Confirm
- QR code for easy contract address sharing
- "Copy Contract Address" button

---

### 8. **Liquidity Pool Setup Screen**
Guide for creating liquidity pools on Uniswap.

**Content:**
- Header: "Set Up Liquidity Pool"
- Network indicator (Sepolia or Mainnet)
- **Warning banner** (for Mainnet):
  - "⚠️ Liquidity pool on Mainnet requires real ETH and tokens"
  - "Ensure you have sufficient funds before proceeding"
- Uniswap link (Sepolia or Mainnet based on project network)
- Step-by-step instructions:
  1. Visit Uniswap (link provided)
  2. Connect wallet
  3. Select token pair (Your Token + ETH)
  4. Set initial price and liquidity amount
  5. Review and confirm
- Info section explaining liquidity pools and their importance
- "Open Uniswap" button (external link)

---

### 9. **Settings Screen** (Tab: Settings)
App settings and configuration.

**Content:**
- Header: "Settings"
- **Environment Configuration Section:**
  - RPC URL input (Sepolia)
  - RPC URL input (Mainnet)
  - Private key input (masked)
  - Save button
- **App Preferences:**
  - Theme toggle (Light/Dark)
  - Notifications toggle
- **About Section:**
  - App version
  - GitHub repository link
  - Documentation link
  - Support/Feedback link

---

## Primary Content and Functionality

### Home Screen
- **Functionality:** Quick navigation to all major features
- **Content:** Overview cards, recent projects, call-to-action buttons
- **Key Interaction:** Tap card → Navigate to Projects or Setup Wizard

### Projects List
- **Functionality:** Browse all token projects with filtering
- **Content:** Project cards with status indicators
- **Key Interaction:** Tap project → View Project Detail

### Setup Wizard
- **Functionality:** Multi-step form to create a new token project
- **Content:** Input fields, radio buttons, confirmation summary
- **Key Interaction:** Fill form → Review → Create project

### Project Detail
- **Functionality:** Central hub for managing a token project
- **Content:** Tabs for different aspects (contract, deployment, wallet, liquidity)
- **Key Interaction:** Tap tab → View/edit that section

### Contract Editor
- **Functionality:** Display and copy the ERC-20 contract code
- **Content:** Syntax-highlighted Solidity code
- **Key Interaction:** Tap copy button → Copy to clipboard

### Deploy Screen
- **Functionality:** Guide deployment process with safety checks
- **Content:** Prerequisites, deployment command, status
- **Key Interaction:** Tap deploy button → Show deployment instructions

### Wallet Integration
- **Functionality:** Step-by-step guide to add token to wallet
- **Content:** Contract address, instructions, QR code
- **Key Interaction:** Tap copy button → Copy address; scan QR → Share

### Liquidity Pool Setup
- **Functionality:** Guide to create liquidity pool on Uniswap
- **Content:** Instructions, network-specific Uniswap link
- **Key Interaction:** Tap "Open Uniswap" → External link

### Settings
- **Functionality:** Configure RPC URLs and app preferences
- **Content:** Input fields, toggles
- **Key Interaction:** Edit fields → Save

---

## Key User Flows

### Flow 1: Create and Deploy Token on Sepolia (Testnet)
1. User taps "Start New Project" on Home
2. Enters token details (name, symbol, supply, decimals)
3. Selects "Sepolia (Testnet)"
4. Reviews and confirms
5. Project created in "Draft" state
6. Views Project Detail → Deploy tab
7. Follows deployment instructions
8. Deployment succeeds → Status changes to "Deployed"
9. Contract address displayed

### Flow 2: Add Token to MetaMask
1. User views Project Detail → Wallet tab
2. Sees contract address and token details
3. Taps "Copy Contract Address"
4. Opens MetaMask on device
5. Goes to "Import Token"
6. Pastes contract address
7. Token appears in wallet

### Flow 3: Create Liquidity Pool on Sepolia
1. User views Project Detail → Liquidity tab
2. Sees Sepolia Uniswap link
3. Taps "Open Uniswap"
4. Connects wallet in Uniswap
5. Creates liquidity pool with test ETH and tokens
6. Confirms transaction

### Flow 4: Deploy Token on Mainnet (Production)
1. User creates new project, selects "Ethereum (Mainnet)"
2. Sees prominent warning: "Mainnet deployment is permanent and costs real ETH"
3. Views Deploy tab with prerequisites checklist
4. Follows deployment instructions
5. Deployment succeeds
6. Token is now live on Ethereum mainnet

---

## Color Choices

**Brand Colors:**
- **Primary:** `#0a7ea4` (Ethereum Blue) — Used for primary buttons, active states, links
- **Secondary:** `#f59e0b` (Amber) — Used for warnings, alerts, testnet badges
- **Success:** `#22c55e` (Green) — Used for success states, deployed status
- **Error:** `#ef4444` (Red) — Used for errors, critical warnings
- **Testnet Badge:** Amber background with dark text
- **Mainnet Badge:** Red background with white text (to emphasize production)

**Neutral Colors:**
- **Background:** `#ffffff` (light) / `#151718` (dark)
- **Surface:** `#f5f5f5` (light) / `#1e2022` (dark)
- **Foreground (Text):** `#11181c` (light) / `#ecedee` (dark)
- **Muted (Secondary Text):** `#687076` (light) / `#9ba1a6` (dark)
- **Border:** `#e5e7eb` (light) / `#334155` (dark)

---

## Typography

- **Headings:** System font, bold, 24-32px
- **Body:** System font, regular, 14-16px
- **Code/Monospace:** Courier New or Monaco, 12-14px
- **Labels:** System font, medium, 12-14px

---

## Interaction Patterns

- **Buttons:** Tap to activate, scale feedback (0.97x), haptic feedback on primary actions
- **Cards:** Tap to navigate, opacity feedback (0.7x) on press
- **Tabs:** Tap to switch, underline indicator
- **Inputs:** Keyboard appears on tap, validation on blur
- **Warnings:** Prominent banner with icon, high contrast colors
- **Copy Actions:** Toast notification "Copied to clipboard" after successful copy

---

## Safety & Warnings

- **Testnet vs. Mainnet:** Color-coded badges and prominent labeling throughout
- **Mainnet Warnings:** Red banner with ⚠️ icon on all mainnet-related screens
- **Prerequisites Checklist:** Before deployment, users must confirm they have:
  - Hardhat project set up
  - .env file configured
  - Sufficient ETH for gas
- **Contract Address:** Always copyable and shareable via QR code
- **External Links:** Clearly marked as opening in external browser

---

## Accessibility

- **High Contrast:** All text meets WCAG AA standards
- **Touch Targets:** Minimum 44x44pt for all interactive elements
- **Labels:** All inputs have clear labels
- **Dark Mode:** Full support with proper color contrast
- **Haptic Feedback:** Subtle, non-intrusive feedback for key interactions
