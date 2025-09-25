import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
import { Vote as VoteIcon, Shield, Loader, AlertCircle } from 'lucide-react'
import VOTING_ABI from '../artifacts/contracts/Voting.sol/Voting.json'
import TOKEN_ABI from '../artifacts/contracts/TestToken.sol/TestToken.json'

import WalletConnect from './components/WalletConnect'
import ProposalCard from './components/ProposalCard'
import AdminPanel from './components/AdminPanel'
import { CONTRACT_ADDRESS, TOKEN_ADDRESS, PROPOSAL_FEE } from './utils/contract'

function App() {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [proposals, setProposals] = useState([])
  const [votedProposals, setVotedProposals] = useState(new Set())
  const [winner, setWinner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeclaring, setIsDeclaring] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  // MetaMask account change listener
  useEffect(() => {
    if (!window.ethereum) return
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null)
        setIsAdmin(false)
        setProposals([])
        setVotedProposals(new Set())
        setWinner(null)
      } else {
        setAccount(accounts[0])
        checkAdminStatus(accounts[0])
      }
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const isMetaMaskInstalled = () => typeof window.ethereum !== 'undefined'

  // Ensure Ganache network
  const ensureGanacheNetwork = async () => {
    if (!window.ethereum) throw new Error('MetaMask not installed')
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    if (chainId !== '0x539') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }],
        })
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x539',
                chainName: 'Local Ganache',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          })
        } else throw switchError
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }
    setIsConnecting(true)
    try {
      await ensureGanacheNetwork()
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setAccount(address)
      await checkAdminStatus(address)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setIsAdmin(false)
    setVotedProposals(new Set())
    toast.success('Wallet disconnected')
  }

  // Contract helpers
  const getVotingContract = (signerOrProvider) =>
    new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI.abi, signerOrProvider)

  const getTokenContract = (signerOrProvider) =>
    new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI.abi, signerOrProvider)

  // Admin check
  const checkAdminStatus = async (address) => {
    try {
      if (!window.ethereum) return
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = getVotingContract(provider)
      const adminAddress = await contract.admin()
      setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase())
    } catch (error) {
      console.error('Error checking admin status:', error)
      toast.error('Failed to check admin status')
    }
  }
  // Fetch proposals
  const fetchProposals = async () => {
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = getVotingContract(signer)
      const proposalsData = await contract.getProposals()
      const formatted = proposalsData.map((p, i) => ({
        id: i,
        title: p.title,
        description: p.description,
        voteCount: Number(p.voteCount),
      }))
      setProposals(formatted)
      if (account) await checkVotingStatus(formatted)
    } catch (error) {
      console.error('Error fetching proposals:', error)
      toast.error('Failed to fetch proposals')
    } finally {
      setLoading(false)
    }
  }

  const checkVotingStatus = async (proposalsList) => {
    if (!account) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = getVotingContract(signer)
      const votedSet = new Set()
      for (const proposal of proposalsList) {
        const hasVoted = await contract.hasVoted(proposal.id, account)
        if (hasVoted) votedSet.add(proposal.id)
      }
      setVotedProposals(votedSet)
    } catch (error) {
      console.error('Error checking voting status:', error)
    }
  }

  const fetchWinner = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = getVotingContract(signer)
      const [winnerId, title, votes] = await contract.declareWinner()
      if (title && title.trim() !== '') {
        setWinner({ id: Number(winnerId), title, voteCount: Number(votes) })
      }
    } catch (error) {
      console.error('Error fetching winner:', error)
    }
  }

  const ensureAllowance = async (tokenContract, owner, spender, amount) => {
    const current = await tokenContract.allowance(owner, spender)
    if (BigInt(current.toString()) >= BigInt(amount.toString())) return true
    const tx = await tokenContract.approve(spender, amount)
    toast.loading('Approving tokens...', { id: 'approve' })
    await tx.wait()
    toast.success('Tokens approved!', { id: 'approve' })
    return true
  }

  const createProposal = async (title, description) => {
    if (!account) {
      toast.error('Please connect wallet')
      return
    }
    setIsCreating(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const votingContract = getVotingContract(signer)
      const tokenContract = getTokenContract(signer)
      const amount = ethers.parseUnits(PROPOSAL_FEE.toString(), 18)
      await ensureAllowance(tokenContract, account, CONTRACT_ADDRESS, amount)
      toast.loading('Creating proposal...', { id: 'create-proposal' })
      const tx = await votingContract.createProposal(title, description)
      await tx.wait()
      toast.success('Proposal created successfully!', { id: 'create-proposal' })
      await fetchProposals()
    } catch (error) {
      console.error('Create proposal error:', error)
      toast.error('Failed to create proposal', { id: 'create-proposal' })
    } finally {
      setIsCreating(false)
    }
  }

  const vote = async (proposalId) => {
    if (!account) {
      toast.error('Please connect your wallet')
      return
    }
    setIsVoting(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const votingContract = getVotingContract(signer)
      const tx = await votingContract.vote(proposalId)
      toast.loading('Submitting vote...', { id: 'vote' })
      await tx.wait()
      toast.success('Vote submitted successfully!', { id: 'vote' })
      setVotedProposals((prev) => new Set([...prev, proposalId]))
      await fetchProposals()
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to submit vote', { id: 'vote' })
    } finally {
      setIsVoting(false)
    }
  }

  const declareWinner = async () => {
    if (!account) {
      toast.error('Please connect your wallet')
      return
    }
    setIsDeclaring(true)
    try {
      await fetchWinner()
      toast.success('Winner fetched successfully!', { id: 'declare-winner' })
    } catch (error) {
      console.error('Error declaring winner:', error)
      toast.error('Failed to fetch winner', { id: 'declare-winner' })
    } finally {
      setIsDeclaring(false)
    }
  }

  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)
          await checkAdminStatus(address)
        }
      } catch (error) {
        console.error('Auto-connect error:', error)
      }
    }
    autoConnect()
  }, [])

  useEffect(() => {
    if (!account) return
    const updateAccountData = async () => {
      await checkAdminStatus(account)
      await fetchProposals()
      await fetchWinner()
    }
    updateAccountData()
  }, [account])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <Toaster position='top-right' />

      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-600 p-2 rounded-lg'>
                <VoteIcon className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Voting Decentralised App
                </h1>
                <p className='text-sm text-gray-600'>
                  Decentralized Voting Platform
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              {isAdmin && (
                <div className='flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium'>
                  <Shield className='w-3 h-3' />
                  Admin
                </div>
              )}
              <WalletConnect
                account={account}
                isConnecting={isConnecting}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
              />
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {!isMetaMaskInstalled() ? (
          <div className='text-center py-16'>
            <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              MetaMask Required
            </h2>
            <p className='text-gray-600 mb-6'>
              Please install MetaMask to use this dApp.
            </p>
          </div>
        ) : !account ? (
          <div className='text-center py-16'>
            <VoteIcon className='w-16 h-16 text-blue-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Connect Your Wallet
            </h2>
            <p className='text-gray-600 mb-6'>
              Connect your wallet to start voting on proposals.
            </p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200'
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className='space-y-8'>
            {isAdmin && (
              <AdminPanel
                onCreateProposal={createProposal}
                onDeclareWinner={declareWinner}
                winner={winner}
                isCreating={isCreating}
                isDeclaring={isDeclaring}
              />
            )}

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h3 className='font-medium text-blue-900 mb-2'>
                Contract Information
              </h3>
              <p className='text-sm text-blue-700'>
                <strong>Address:</strong> {CONTRACT_ADDRESS}
              </p>
              <p className='text-sm text-blue-700'>
                <strong>Token Address:</strong> {TOKEN_ADDRESS}
              </p>
              <p className='text-sm text-blue-700'>
                <strong>Proposal Fee:</strong>{' '}
                {ethers.formatUnits(PROPOSAL_FEE, 18)} tokens
              </p>
            </div>

            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Proposals</h2>
                <button
                  onClick={fetchProposals}
                  disabled={loading}
                  className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200'
                >
                  <Loader
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className='text-center py-12'>
                  <Loader className='w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin' />
                  <p className='text-gray-600'>Loading proposals...</p>
                </div>
              ) : proposals.length === 0 ? (
                <div className='text-center py-12'>
                  <VoteIcon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No Proposals Yet
                  </h3>
                  <p className='text-gray-600'>
                    {isAdmin
                      ? 'Create the first proposal to get started.'
                      : 'No proposals available for voting.'}
                  </p>
                </div>
              ) : (
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onVote={vote}
                      hasVoted={votedProposals.has(proposal.id)}
                      account={account}
                      isVoting={isVoting}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
