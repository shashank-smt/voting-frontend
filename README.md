# Voting dApp Frontend

A modern, responsive frontend for a Solidity-based voting decentralized application built with React, Vite, and ethers.js.

## Features

- **Wallet Integration**: Connect/disconnect MetaMask wallet with automatic detection
- **Proposal Management**: View all proposals with real-time vote counts
- **Voting System**: Vote on proposals with duplicate prevention
- **Admin Panel**: Create proposals and declare winners (admin only)
- **Real-time Updates**: Automatic UI updates after transactions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Transaction Feedback**: Toast notifications for all interactions

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- A deployed Voting smart contract on Ethereum testnet

## Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Update contract configuration in `src/utils/contract.js`:
```javascript
// Replace with your deployed contract address
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';

// Replace with your contract ABI
export const CONTRACT_ABI = [
  // Your contract ABI array
];
```

## Smart Contract Requirements

Your Solidity contract should implement these functions:

```solidity
// View functions
function getProposals() external view returns (Proposal[] memory);
function hasVoted(uint256 _proposalId, address _voter) external view returns (bool);
function admin() external view returns (address);
function winner() external view returns (Proposal memory);

// Write functions
function createProposal(string memory _title, string memory _description) external;
function vote(uint256 _proposalId) external;
function declareWinner() external;
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
1. Connect your MetaMask wallet
2. Browse available proposals
3. Click "Vote" on your preferred proposals
4. Track vote counts in real-time

### For Admins:
1. Connect your admin wallet
2. Use the Admin Panel to create new proposals
3. Declare winners when voting is complete
4. View winner information

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.jsx    # Wallet connection component
│   ├── ProposalCard.jsx     # Individual proposal display
│   └── AdminPanel.jsx       # Admin functions panel
├── utils/
│   └── contract.js          # Contract configuration and utilities
├── App.jsx                  # Main application component
└── main.jsx                # Application entry point
```

## Configuration

### Environment Variables (Optional)

You can create a `.env` file for environment-specific configuration:

```env
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_NETWORK_NAME=sepolia
```

### Network Configuration

Make sure MetaMask is connected to the correct network where your contract is deployed.

## Troubleshooting

### Common Issues:

1. **"Please install MetaMask"**: Install the MetaMask browser extension
2. **"Failed to connect wallet"**: Ensure MetaMask is unlocked and on the correct network
3. **"Transaction failed"**: Check if you have sufficient ETH for gas fees
4. **"Contract not found"**: Verify the contract address and ABI are correct

### Error Codes:

- `CALL_EXCEPTION`: Contract function call failed (check parameters)
- `INSUFFICIENT_FUNDS`: Not enough ETH for transaction
- `USER_REJECTED`: Transaction was rejected in MetaMask

## License

MIT License - feel free to use this project as a starting point for your own voting dApp!