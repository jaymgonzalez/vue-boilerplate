import { createClient } from '@/utils/supabase/server'
import TradesTable from '@/components/trades-table'

export default async function Trades() {
  const supabase = await createClient()
  const { data: trades } = await supabase.from('trades').select()
  return <TradesTable trades={trades || []} />
}
