import { createClient } from '@/utils/supabase/server'
import PositionsTable from '@/components/positions-table'

export default async function Positions() {
  const supabase = await createClient()
  const { data: positions } = await supabase
    .from('consolidated_trades')
    .select()
  return <PositionsTable positions={positions || []} />
}
