// hooks/useTradeData.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { HyperliquidTrade, DBTrade } from '@/helper/types/trades'
import { processTrades } from '@/utils/create-positions'

interface DbPosition {
  id: number
  user_id: string
  trade_ids: number[]
}

interface TradeData {
  trades: DBTrade[]
  positions: DbPosition[]
}

export function useTradeData(userId: string | undefined) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dbData', userId],
    queryFn: async () => {
      const [tradesResponse, positionsResponse] = await Promise.all([
        supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .order('time', { ascending: true }),
        supabase
          .from('positions')
          .select('user_id, id, trade_ids')
          .eq('user_id', userId),
      ])

      if (tradesResponse.error) throw tradesResponse.error
      if (positionsResponse.error) throw positionsResponse.error

      return {
        trades: tradesResponse.data as DBTrade[],
        positions: positionsResponse.data as DbPosition[],
      } as TradeData
    },
    enabled: !!userId,
  })
}

export function useHyperliquidTrades(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['hlTrades', walletAddress],
    queryFn: async () => {
      const response = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'userFills',
          user: walletAddress,
          aggregateByTime: true,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch trades')
      return processTrades(await response.json()) as HyperliquidTrade[]
    },
    enabled: !!walletAddress,
  })
}
