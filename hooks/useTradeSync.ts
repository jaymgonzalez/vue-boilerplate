// hooks/useTradeSync.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { HyperliquidTrade, DBTrade } from '@/helper/types/trades'
import { consolidateTrades } from '@/utils/create-positions'
import { PostgrestError } from '@supabase/supabase-js'

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

interface SyncResult {
  error: PostgrestError | null
  data: any
}

export function useTradeSync() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const arrayEquals = (a: number[], b: number[]) =>
    a.length === b.length && a.every((val, idx) => val === b[idx])

  return useMutation({
    mutationFn: async ({
      hlTrades,
      dbTrades,
      dbPositions,
    }: SyncTradesParams) => {
      if (!hlTrades?.length || !dbTrades || !dbPositions) {
        throw new Error('Missing required data for sync')
      }

      const newTrades = hlTrades.filter(
        (trade) => !dbTrades.some((dbTrade) => dbTrade.oid === trade.oid)
      )

      const consolidatedTrades = consolidateTrades(dbTrades)
      const dbPositionsMap = new Map(dbPositions.map((pos) => [pos.id, pos]))
      const newPositions = consolidatedTrades.filter(
        (pos) => !dbPositionsMap.has(pos.id)
      )
      const updatedPositions = consolidatedTrades.filter((pos) => {
        const existingPos = dbPositionsMap.get(pos.id)
        return existingPos && !arrayEquals(existingPos.trade_ids, pos.trade_ids)
      })

      const operations = []

      if (newTrades.length) {
        operations.push(supabase.from('trades').insert(newTrades))
      }
      if (newPositions.length) {
        operations.push(supabase.from('positions').insert(newPositions))
      }
      if (updatedPositions.length) {
        operations.push(supabase.from('positions').upsert(updatedPositions))
      }

      if (operations.length === 0) {
        return {
          newTradesCount: 0,
          newPositionsCount: 0,
          updatedPositionsCount: 0,
        }
      }

      const results = (await Promise.all(operations)) as SyncResult[]

      const error = results.find((result) => result.error)?.error
      if (error) throw error

      return {
        newTradesCount: newTrades.length,
        newPositionsCount: newPositions.length,
        updatedPositionsCount: updatedPositions.length,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dbData'] })
      queryClient.invalidateQueries({ queryKey: ['hlTrades'] })
    },
  })
}
