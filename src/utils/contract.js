import { ethers } from 'ethers'
import VotingABI from '../../artifacts/contracts/Voting.sol/Voting.json'
import ERC20ABI from '../../artifacts/contracts/TestToken.sol/TestToken.json'


// ✅ Ganache deployed addresses
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
export const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS

// ✅ Proposal fee = 10 tokens (with 18 decimals)
export const PROPOSAL_FEE = ethers.parseUnits('10', 18)

export const getVotingContract = (signerOrProvider) =>
  new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signerOrProvider)

export const getTokenContract = (signerOrProvider) =>
  new ethers.Contract(TOKEN_ADDRESS, ERC20ABI.abi, signerOrProvider)

export const formatAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
