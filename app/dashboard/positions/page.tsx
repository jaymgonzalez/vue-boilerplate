import { createClient } from '@/utils/supabase/server'
import PositionsTable from '@/components/positions-table'

export default async function Positions() {
  const supabase = await createClient()
  const { data: positions } = await supabase
    .from('positions')
    .select()
    .order('close_time', { ascending: false })
  return <PositionsTable positions={positions || []} />
}
