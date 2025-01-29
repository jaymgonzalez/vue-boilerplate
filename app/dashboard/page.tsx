'use client'

import { createClient } from '@/utils/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HyperliquidTrade, Position, DBTrade } from '@/helper/types/trades'
import { consolidateTrades } from '@/utils/create-positions'
import { useEffect } from 'react'
import TradeSync from '@/components/trade-sync'

export default function Dashboard() {
  return (
    <>
      <TradeSync />
      <div></div>
    </>
  )
}
