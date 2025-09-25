import { ethers } from 'ethers'
import VotingABI from '../../artifacts/contracts/Voting.sol/Voting.json'
import ERC20ABI from '../../artifacts/contracts/TestToken.sol/TestToken.json'

// ✅ Ganache deployed addresses
export const CONTRACT_ADDRESS = '0xAd47D5d38EE3a71A7155b05F01bd10eE31aB5F63'
export const TOKEN_ADDRESS = '0xE8135A7627D25978b84AC7DAe156445BB7D0dA56'

// ✅ Proposal fee = 10 tokens (with 18 decimals)
export const PROPOSAL_FEE = ethers.parseUnits('10', 18)

export const getVotingContract = (signerOrProvider) =>
  new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signerOrProvider)

export const getTokenContract = (signerOrProvider) =>
  new ethers.Contract(TOKEN_ADDRESS, ERC20ABI.abi, signerOrProvider)

export const formatAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
