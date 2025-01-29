import { DBTrade, HyperliquidTrade, Position } from '@/helper/types/trades'

interface OpenPosition extends Position {
  remaining_size: number
  all_trades: DBTrade[]
}

interface OpenPositions {
  [key: string]: OpenPosition
}

const calculateDollarSize = (price: number, size: number): number =>
  Math.round(price * size * 100) / 100

const roundFinancialValue = (value: number): number =>
  Math.round(value * 100000) / 100000

const createNewPosition = (trade: DBTrade, direction: string): OpenPosition => {
  // Ensure we capture all trade IDs from the opening trade
  const tradeIds = new Set<number>()
  if (Array.isArray(trade.trade_ids)) {
    trade.trade_ids.forEach((id) => tradeIds.add(id))
  } else {
    tradeIds.add(trade.oid)
  }

  return {
    id: trade.oid,
    coin: trade.coin,
    px: trade.px,
    sz: trade.sz,
    side: trade.side,
    dir: direction,
    closedPnl: 0.0,
    fee: trade.fee,
    feeToken: trade.feeToken,
    remaining_size: trade.sz,
    close_time: trade.time,
    dollar_size: calculateDollarSize(trade.px, trade.sz),
    closed: false,
    time_in_trade: 0,
    trade_ids: Array.from(tradeIds),
    all_trades: [trade],
  }
}

const finalizePosition = (
  position: OpenPosition,
  closed: boolean = true
): Position => {
  const firstTradeTime = position.all_trades[0]?.time ?? 0

  // Collect all unique trade IDs from all trades
  const allTradeIds = new Set<number>()
  position.all_trades.forEach((trade) => {
    if (Array.isArray(trade.trade_ids)) {
      trade.trade_ids.forEach((id: number) => allTradeIds.add(id))
    }
    allTradeIds.add(trade.oid)
  })

  const sortedTrades = [...position.all_trades].sort((a, b) => a.time - b.time)

  const finalPosition: Position = {
    ...position,
    starting_time: firstTradeTime,
    time_in_trade: position.close_time - firstTradeTime,
    trade_ids: Array.from(allTradeIds),
    closedPnl: roundFinancialValue(position.closedPnl),
    fee: roundFinancialValue(position.fee),
    closed,
  }

  delete finalPosition.remaining_size
  delete finalPosition.all_trades

  return finalPosition
}

export function consolidateTrades(trades: DBTrade[]): Position[] {
  const consolidated: Position[] = []
  const openPositions: OpenPositions = {}
  let positionCounter = 0

  // Sort trades by time first
  const sortedTrades = [...trades].sort((a, b) => a.time - b.time)

  sortedTrades.forEach((trade) => {
    const coin = trade.coin
    const direction = trade.dir.split(' ')[1]
    const isOpening = trade.dir.includes('Open')

    if (isOpening) {
      const positionId = `${coin}-${direction}-${positionCounter++}`
      openPositions[positionId] = createNewPosition(trade, direction)
      return
    }

    const [matchingKey, matchingPosition] = Object.entries(openPositions).find(
      ([_, pos]) =>
        pos.coin === coin && pos.dir === direction && pos.remaining_size > 0
    ) || [null, null]

    if (!matchingPosition || !matchingKey) return

    // Update position with closing trade
    matchingPosition.closedPnl += trade.closedPnl ?? 0
    matchingPosition.fee += trade.fee
    matchingPosition.remaining_size -= trade.closeSize ?? trade.sz
    matchingPosition.close_time = Math.max(
      matchingPosition.close_time,
      trade.time
    )

    // Add all trade IDs from the closing trade
    if (Array.isArray(trade.trade_ids)) {
      matchingPosition.trade_ids.push(...trade.trade_ids)
    }
    matchingPosition.trade_ids.push(trade.oid)
    matchingPosition.trade_ids = Array.from(new Set(matchingPosition.trade_ids))

    matchingPosition.all_trades.push(trade)

    if (Math.abs(matchingPosition.remaining_size) < 0.00001) {
      consolidated.push(finalizePosition(matchingPosition))
      delete openPositions[matchingKey]
    }
  })

  Object.values(openPositions).forEach((position) => {
    consolidated.push(finalizePosition(position, false))
  })

  return consolidated
}
export function processTrades(trades: HyperliquidTrade[]): HyperliquidTrade[] {
  // Remove pid and hash, and aggregate by oid
  const oidMap = new Map()

  trades.forEach((trade) => {
    // Create a new object without pid and hash
    const { tid, hash, builderFee, ...cleanTrade } = trade

    // Convert numeric strings to numbers for summation
    const numericTrade = {
      ...cleanTrade,
      closedPnl: parseFloat(cleanTrade.closedPnl ?? '0') || 0,
      fee: parseFloat(cleanTrade.fee) || 0,
      sz: parseFloat(cleanTrade.sz) || 0,
    }

    if (oidMap.has(numericTrade.oid)) {
      // If oid exists, sum the specified fields
      const existingTrade = oidMap.get(numericTrade.oid)
      existingTrade.closedPnl += numericTrade.closedPnl
      existingTrade.fee += numericTrade.fee
      existingTrade.sz += numericTrade.sz
    } else {
      // If oid is new, add the trade to the map
      oidMap.set(numericTrade.oid, numericTrade)
    }
  })

  // Convert numeric values back to strings and return array of trades
  return Array.from(oidMap.values()).map((trade) => ({
    ...trade,
    closedPnl: trade.closedPnl.toString(),
    fee: trade.fee.toString(),
    sz: trade.sz.toString(),
  }))
}
