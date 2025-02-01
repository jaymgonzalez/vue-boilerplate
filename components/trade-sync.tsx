'use client'

import { useCallback, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTradeData, useHyperliquidTrades } from '@/hooks/useTrades'
import { useTradeSync } from '@/hooks/useTradeSync'

export default function TradeSync() {
  const { data: authData, isError: isAuthError } = useAuth()
  const { data: dbData, isError: isDbError } = useTradeData(authData?.user.id)
  const { data: hlTrades, isError: isHlError } = useHyperliquidTrades(
    authData?.profile.wallet_address
  )
  const syncMutation = useTradeSync()

  const syncTrades = useCallback(() => {
    if (hlTrades && dbData?.trades && dbData?.positions) {
      syncMutation.mutate({
        hlTrades,
        dbTrades: dbData.trades,
        dbPositions: dbData.positions,
      })
    }
  }, [hlTrades, dbData, syncMutation])

  useEffect(() => {
    syncTrades()
  }, [syncTrades])

  if (isAuthError || isDbError || isHlError) {
    return <div>Error syncing trades. Please try again later.</div>
  }

  return null
}
