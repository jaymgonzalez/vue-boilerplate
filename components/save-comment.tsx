'use client'

import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface TradeCommentInputProps {
  tradeId: number
  initialComment?: string
}

export function TradeCommentInput({
  tradeId,
  initialComment = '',
}: TradeCommentInputProps) {
  const [comments, setComments] = useState(initialComment)
  const supabase = createClient()
  // const queryClient = useQueryClient()
  const router = useRouter()

  const getPrevComment = async () => {
    const { data, error } = await supabase
      .from('consolidated_trades')
      .select('comments')
      .eq('id', tradeId)
      .single()

    if (data) {
      setComments(data.comments)
    }

    if (error) {
      console.error('Error fetching previous comment:', error)
      throw error
    }
  }

  const { mutate, status } = useMutation({
    mutationFn: async (newComment: string) => {
      // const {
      // data: { user },
      // } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('consolidated_trades')
        .update({
          comments: newComment,
          // user_id: user?.id,
        })
        .eq('id', tradeId)

      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({
      //   queryKey: ['trade', tradeId],
      // })
      router.refresh()
    },
    onError: (error) => {
      console.error('Error saving comment:', error)
    },
  })

  const handleSaveComment = () => {
    mutate(comments)
  }

  useEffect(() => {
    getPrevComment()
  }, [])

  return (
    <div>
      <fieldset className="fieldset flex items-center gap-2">
        {/* <legend className="fieldset-legend">Comments</legend> */}
        <textarea
          className="textarea textarea-bordered flex-grow placeholder-gray-600"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add a comment to this trade"
        />
        <button
          className="btn btn-primary"
          onClick={handleSaveComment}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Saving...' : 'Save Comment'}
        </button>
      </fieldset>
    </div>
  )
}

export default TradeCommentInput
