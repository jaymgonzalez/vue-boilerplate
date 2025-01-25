import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: trades } = await supabase.from('trades').select()

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Coin</th>
          <th>Direction</th>
          <th>Price</th>
          <th>Size</th>
          <th>Value</th>
          <th>Fee</th>
          <th>Closed PnL</th>
        </tr>
      </thead>
      <tbody>
        {trades &&
          trades.map((trade) => (
            <tr key={trade.id}>
              <td>{new Date(trade.time).toLocaleDateString('en-UK')}</td>
              <td>{trade.coin}</td>
              <td>{trade.dir}</td>
              <td>{trade.px}</td>
              <td>{trade.sz}</td>
              <td>{(trade.px * trade.sz).toFixed(2)}</td>
              <td>{trade.fee.toFixed(2)}</td>
              <td>{trade.closedPnl.toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
