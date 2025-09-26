# Voting dApp Frontend

A modern, responsive frontend for a Solidity-based voting decentralized application built with React, TypeScript, Vite, and ethers.js. This dApp integrates with Ganache local blockchain and includes token-based proposal creation with ERC20 token integration.

## Features

- **Wallet Integration**: Connect/disconnect MetaMask wallet with automatic Ganache network detection
- **Proposal Management**: View all proposals with real-time vote counts and descriptions
- **Voting System**: Vote on proposals with duplicate prevention and real-time status updates
- **Admin Panel**: Create proposals (with 10 token fee) and declare winners (admin only)
- **Token Integration**: ERC20 token approval system for proposal creation
- **Real-time Updates**: Automatic UI updates after transactions with loading states
- **Responsive Design**: Mobile-first design with Tailwind CSS and modern UI components
- **Transaction Feedback**: Toast notifications for all interactions and error handling
- **Network Management**: Automatic Ganache network switching and validation

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Ganache local blockchain running on port 8545
- Deployed Voting and TestToken smart contracts on Ganache
- Test accounts funded with ETH and tokens

## Installation

1. Clone and install dependencies:

```bash
npm install
```

2. Start Ganache local blockchain:

   - Install Ganache from [trufflesuite.com](https://trufflesuite.com/ganache/)
   - Start Ganache on port 8545
   - Note the RPC URL: `http://127.0.0.1:8545`

3. Deploy smart contracts to Ganache:

   - Deploy Voting contract and note the address
   - Deploy TestToken contract and note the address
   - Fund test accounts with tokens

4. Configure MetaMask:

   - Add Ganache network (Chain ID: 1337, RPC URL: http://127.0.0.1:8545)
   - Import test accounts from Ganache
   - Ensure accounts have both ETH and tokens

5. Update contract configuration in `src/utils/contract.js`:

```javascript
// Update with your deployed contract addresses
export const CONTRACT_ADDRESS = '0xAd47D5d38EE3a71A7155b05F01bd10eE31aB5F63' // Your Voting contract
export const TOKEN_ADDRESS = '0xE8135A7627D25978b84AC7DAe156445BB7D0dA56' // Your Token contract
export const PROPOSAL_FEE = ethers.parseUnits('10', 18) // 10 tokens
```

## Smart Contract Requirements

Your Solidity contracts should implement these functions:

### Voting Contract Functions:

```solidity
// View functions
function getProposals() external view returns (Proposal[] memory);
function hasVoted(uint256 _proposalId, address _voter) external view returns (bool);
function admin() external view returns (address);
function declareWinner() external view returns (uint256, string memory, uint256);

// Write functions
function createProposal(string memory _title, string memory _description) external;
function vote(uint256 _proposalId) external;
```

### TestToken Contract Functions (ERC20):

```solidity
// Required ERC20 functions
function approve(address spender, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

### For Users:

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Browse Proposals**: View all available proposals with descriptions and vote counts
3. **Vote**: Click "Vote" on your preferred proposals (one vote per proposal)
4. **Track Status**: See real-time vote counts and your voting status
5. **View Results**: Check which proposals you've already voted for

### For Admins:

1. **Connect Admin Wallet**: Use the admin account to connect
2. **Create Proposals**: Use the Admin Panel to create new proposals (requires 10 tokens)
3. **Token Approval**: Approve token spending when creating proposals
4. **Declare Winners**: Use the "Declare Winner" button to fetch winning proposal
5. **Monitor Results**: View current winner and vote counts

### Key Features:

- **Automatic Network Switching**: App automatically switches to Ganache network
- **Token Integration**: Proposal creation requires ERC20 token approval
- **Real-time Updates**: UI updates immediately after transactions
- **Error Handling**: Comprehensive error messages and loading states
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
voting-frontend/
├── src/
│   ├── components/
│   │   ├── WalletConnect.jsx    # Wallet connection component
│   │   ├── ProposalCard.jsx     # Individual proposal display
│   │   └── AdminPanel.jsx       # Admin functions panel
│   ├── utils/
│   │   └── contract.js          # Contract configuration and utilities
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── artifacts/
│   └── contracts/
│       ├── Voting.sol/
│       │   └── Voting.json      # Voting contract ABI
│       └── TestToken.sol/
│           └── TestToken.json   # Token contract ABI
├── package.json                # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Dependencies

### Core Dependencies:

- **React 18.3.1** - UI framework
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **ethers 6.15.0** - Ethereum blockchain interaction
- **react-hot-toast 2.6.0** - Toast notifications
- **lucide-react 0.344.0** - Icon library

### Development Dependencies:

- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **ESLint 9.9.1** - Code linting
- **@vitejs/plugin-react 4.3.1** - React plugin for Vite

## Configuration

### Contract Configuration

The application is configured to work with Ganache local blockchain:

```javascript
// src/utils/contract.js
export const CONTRACT_ADDRESS = '0xAd47D5d38EE3a71A7155b05F01bd10eE31aB5F63'
export const TOKEN_ADDRESS = '0xE8135A7627D25978b84AC7DAe156445BB7D0dA56'
export const PROPOSAL_FEE = ethers.parseUnits('10', 18) // 10 tokens
```

### Network Configuration

- **Network**: Ganache Local Blockchain
- **Chain ID**: 1337 (0x539)
- **RPC URL**: http://127.0.0.1:8545
- **Currency**: ETH

### MetaMask Setup

1. Add Ganache network to MetaMask
2. Import test accounts from Ganache
3. Ensure accounts have both ETH and tokens
4. Switch to Ganache network before using the dApp

## Troubleshooting

### Common Issues:

1. **"Please install MetaMask"**: Install the MetaMask browser extension
2. **"Failed to connect wallet"**: Ensure MetaMask is unlocked and on Ganache network
3. **"Transaction failed"**: Check if you have sufficient ETH for gas fees
4. **"Contract not found"**: Verify the contract addresses in `src/utils/contract.js`
5. **"Insufficient token allowance"**: Approve token spending when creating proposals
6. **"Wrong network"**: Ensure MetaMask is connected to Ganache (Chain ID: 1337)
7. **"Ganache not running"**: Start Ganache local blockchain on port 8545

### Error Codes:

- `CALL_EXCEPTION`: Contract function call failed (check parameters)
- `INSUFFICIENT_FUNDS`: Not enough ETH for gas fees
- `USER_REJECTED`: Transaction was rejected in MetaMask
- `UNPREDICTABLE_GAS_LIMIT`: Contract function may fail (check contract state)

### Debug Steps:

1. **Check Ganache**: Ensure Ganache is running and contracts are deployed
2. **Verify Network**: Confirm MetaMask is on Ganache network (Chain ID: 1337)
3. **Check Balances**: Ensure test accounts have both ETH and tokens
4. **Console Logs**: Check browser console for detailed error messages
5. **Contract Addresses**: Verify addresses in `src/utils/contract.js` match deployed contracts

## License

MIT License - feel free to use this project as a starting point for your own voting dApp!
