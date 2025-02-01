import TradeSync from '@/components/trade-sync'
import {
  FolderIcon,
  InformationCircleIcon,
  ServerIcon,
} from '@heroicons/react/24/solid'

export default function Dashboard() {
  return (
    <>
      <TradeSync />
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <InformationCircleIcon className="inline-block h-8 w-8" />
          </div>
          <div className="stat-title">Trades</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <ServerIcon className="inline-block h-8 w-8" />
          </div>
          <div className="stat-title">New Users</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <FolderIcon className="inline-block h-8 w-8" />
          </div>
          <div className="stat-title">New Registers</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
    </>
  )
}
