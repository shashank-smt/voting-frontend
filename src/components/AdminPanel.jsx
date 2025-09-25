import React, { useState } from 'react'
import { Plus, Trophy, Send, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminPanel = ({
  onCreateProposal,
  onDeclareWinner,
  winner,
  isCreating,
  isDeclaring,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [declaring, setDeclaring] = useState(false)

  const handleCreateProposal = async (e) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in both title and description')
      return
    }

    setCreating(true)
    try {
      await onCreateProposal(title.trim(), description.trim())
      setTitle('')
      setDescription('')
      toast.success('Proposal created successfully!')
    } catch (error) {
      toast.error('Failed to create proposal')
      console.error('Create proposal error:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeclareWinner = async () => {
    setDeclaring(true)
    try {
      await onDeclareWinner()
      toast.success('Winner declared successfully!')
    } catch (error) {
      toast.error('Failed to declare winner')
      console.error('Declare winner error:', error)
    } finally {
      setDeclaring(false)
    }
  }

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='bg-blue-600 p-2 rounded-lg'>
          <Plus className='w-5 h-5 text-white' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Admin Panel</h2>
      </div>

      {/* Create Proposal Form */}
      <form onSubmit={handleCreateProposal} className='space-y-4 mb-8'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Proposal Title
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter proposal title...'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            disabled={creating || isCreating}
          />
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter proposal description...'
            rows={4}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none'
            disabled={creating || isCreating}
          />
        </div>

        <button
          type='submit'
          disabled={
            creating || isCreating || !title.trim() || !description.trim()
          }
          className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed'
        >
          {creating || isCreating ? (
            <>
              <Clock className='w-4 h-4 animate-spin' />
              Creating Proposal...
            </>
          ) : (
            <>
              <Send className='w-4 h-4' />
              Create Proposal
            </>
          )}
        </button>
      </form>

      {/* Declare Winner Section */}
      <div className='pt-6 border-t border-blue-200'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Declare Winner
          </h3>
          <button
            onClick={handleDeclareWinner}
            disabled={declaring || isDeclaring}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed'
          >
            {declaring || isDeclaring ? (
              <>
                <Clock className='w-4 h-4 animate-spin' />
                Declaring...
              </>
            ) : (
              <>
                <Trophy className='w-4 h-4' />
                Declare Winner
              </>
            )}
          </button>
        </div>

        {winner && winner.title && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Trophy className='w-5 h-5 text-yellow-600' />
              <h4 className='font-semibold text-yellow-800'>Current Winner</h4>
            </div>
            <p className='text-yellow-700 font-medium'>{winner.title}</p>
            <p className='text-yellow-600 text-sm mt-1'>
              {winner.voteCount.toString()} votes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
