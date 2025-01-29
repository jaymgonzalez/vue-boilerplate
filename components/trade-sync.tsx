'use client'

import { createClient } from '@/utils/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HyperliquidTrade, DBTrade } from '@/helper/types/trades'
import { consolidateTrades, processTrades } from '@/utils/create-positions'
import { useEffect } from 'react'

interface Profile {
  user_id: string
  wallet_address: string
}

interface SyncTradesParams {
  hlTrades: HyperliquidTrade[]
  dbTrades: DBTrade[]
  dbPositions: DbPosition[]
}

interface DbPosition {
  id: number
  user_id: string
  trade_ids: number[]
}

export default function TradeSync() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  // Query for authenticated user
  const { data: user, isError: isAuthError } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) throw error
      if (!user) throw new Error('No user found')
      return user
    },
  })

  // Query for user profile
  const { data: profile, isError: isProfileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!user?.id, // Only run if we have a user
  })

  // Query for trades in db
  const { data: dbTrades, isError: isDbTradesError } = useQuery({
    queryKey: ['dbTrades', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user?.id)
        .order('time', { ascending: true })

      if (error) throw error
      return data as DBTrade[]
    },
    enabled: !!user?.id, // Only run if we have a user
  })

  // Query for positions in db
  const { data: dbPositions, isError: isDbPositionsError } = useQuery({
    queryKey: ['dbPositions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('user_id, id, trade_ids')
        .eq('user_id', user?.id)

      if (error) throw error
      return data as DbPosition[]
    },
    enabled: !!user?.id, // Only run if we have a user
  })

  // Query for trades
  const {
    data: hlTrades,
    isLoading: isLoadingTrades,
    isError: isTradesError,
    error: tradesError,
  } = useQuery({
    queryKey: ['hlTrades', profile?.wallet_address],
    queryFn: async () => {
      const response = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'userFills',
          user: profile?.wallet_address,
          aggregateByTime: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trades')
      }

      const data = await response.json()
      const trades = processTrades(data)

      return trades as HyperliquidTrade[]
    },
    enabled: !!profile?.wallet_address, // Only run if we have a wallet address
  })

  const { mutate, status } = useMutation({
    mutationFn: async ({
      hlTrades,
      dbTrades,
      dbPositions,
    }: SyncTradesParams) => {
      if (!hlTrades || !dbTrades || !dbPositions) {
        throw new Error('Both trades and dbTrades must be provided')
      }

      const dbOids = dbTrades.map((trade) => trade.oid)
      const newTrades = hlTrades.filter((trade) => !dbOids.includes(trade.oid))

      if (newTrades.length > 0) {
        const { error: tradesError } = await supabase
          .from('trades')
          .insert(newTrades)

        if (tradesError) throw tradesError
      }

      const consolidatedTrades = consolidateTrades(dbTrades)
      const dbPositionsOids = dbPositions.map((position) => position.id)
      const newPositions = consolidatedTrades.filter(
        (position) => !dbPositionsOids.includes(position.id)
      )

      if (newPositions.length > 0) {
        const { error: positionsError } = await supabase
          .from('positions')
          .insert(newPositions)

        if (positionsError) throw positionsError
      }

      const dbPositionsTradeIds = dbPositions
        .flatMap((position) => position.trade_ids)
        .flat()
      const updatedPositions = consolidatedTrades.filter((position) =>
        position.trade_ids.some((id) => !dbPositionsTradeIds.includes(id))
      )

      if (updatedPositions.length > 0) {
        const { error: updateError } = await supabase
          .from('positions')
          .upsert(updatedPositions)

        if (updateError) throw updateError
      }

      return {
        message: 'Successfully synced trades and positions',
        newTradesCount: newTrades.length,
        newPositionsCount: consolidatedTrades.length,
      }
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['hlTrades'] })
      queryClient.invalidateQueries({ queryKey: ['dbTrades'] })
      queryClient.invalidateQueries({ queryKey: ['dbPositions'] })
    },
    onError: (error) => {
      console.error('Error syncing trades:', error)
      // You might want to add error handling/notification here
    },
  })

  useEffect(() => {
    if (hlTrades && dbTrades && dbPositions) {
      mutate({ hlTrades, dbTrades, dbPositions })
    }
    return () => {}
  }, [hlTrades, dbTrades, dbPositions])

  return (
    <div>
      <div className="pt-6 space-y-4">
        <div className="text-sm text-gray-500">
          Wallet Address: {profile?.wallet_address}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Recent Trades</h3>
          <pre className="p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(hlTrades, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
