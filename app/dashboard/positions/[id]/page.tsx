import { createClient } from '@/utils/supabase/server'
import TradeCommentInput from '@/components/save-comment'
import UploadImage from '@/components/upload-image'

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: trade } = await supabase
    .from('consolidated_trades')
    .select('*')
    .eq('id', id)
    .single()

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Trade Details</h2>
        <div>Coin: {trade?.coin}</div>
        <div>Comment: {trade?.comments}</div>
        {trade?.image_url && (
          <div className="">
            Image:
            <figure>
              <img src={trade?.image_url} alt="trade" />
            </figure>
          </div>
        )}
        {/* Add more trade details */}
        <TradeCommentInput tradeId={trade?.id} />
        <UploadImage tradeId={trade?.id} />
      </div>
    </div>
  )
}
