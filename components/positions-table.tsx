'use client'

import { useRouter } from 'next/navigation'
import { Position } from '../helper/types/trades'

export default function PositionsTable({
  positions,
}: Readonly<{
  positions: Position[]
}>) {
  const router = useRouter()

  const handleRowClick = (tradeId: number) => {
    router.push(`/dashboard/positions/${tradeId}`)
  }
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
        {positions &&
          positions.map((position) => (
            <tr
              key={position.id}
              className="hover:bg-base-300 cursor-pointer"
              onClick={() => handleRowClick(position.id)}
            >
              <td>
                {new Date(position.starting_time).toLocaleDateString('en-UK')}
              </td>
              <td>{position.coin}</td>
              <td>{position.dir}</td>
              <td>{position.px}</td>
              <td>{position.sz}</td>
              <td>{(Number(position.px) * Number(position.sz)).toFixed(2)}</td>
              <td>{position.fee.toFixed(2)}</td>
              <td>{position.closedPnl.toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
