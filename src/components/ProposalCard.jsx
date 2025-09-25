import React, { useState } from 'react'
import { Vote, Check, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const ProposalCard = ({ proposal, onVote, hasVoted, account }) => {
  const [voting, setVoting] = useState(false)

  const handleVote = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      return
    }

    if (hasVoted) {
      toast.error('You have already voted for this proposal')
      return
    }

    setVoting(true)
    try {
      await onVote(proposal.id)
      toast.success('Vote submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit vote')
      console.error('Vote error:', error)
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1'>
          <h3 className='text-xl font-bold text-gray-800 mb-2 line-clamp-2'>
            {proposal.title}
          </h3>
          <p className='text-gray-600 text-sm line-clamp-3'>
            {proposal.description}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-100'>
        <div className='flex items-center gap-2'>
          <div className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
            {proposal.voteCount.toString()} votes
          </div>
          {hasVoted && (
            <div className='flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm'>
              <Check className='w-3 h-3' />
              Voted
            </div>
          )}
        </div>

        <button
          onClick={handleVote}
          disabled={!account || hasVoted || voting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            !account
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : hasVoted
              ? 'bg-green-100 text-green-600 cursor-not-allowed'
              : voting
              ? 'bg-blue-100 text-blue-600 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
          }`}
        >
          {voting ? (
            <>
              <Clock className='w-4 h-4 animate-spin' />
              Voting...
            </>
          ) : hasVoted ? (
            <>
              <Check className='w-4 h-4' />
              Voted
            </>
          ) : (
            <>
              <Vote className='w-4 h-4' />
              Vote
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProposalCard
