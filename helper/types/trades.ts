export interface Trade {
  id: number
  time: string
  coin: string
  dir: string
  px: number
  sz: number
  fee: number
  closedPnl: number
}

export interface Position {
  id: number
  coin: string
  px: string
  sz: string
  side: string
  dir: string
  closedPnl: number
  fee: number
  feeToken: string
  close_time: number
  dollar_size: number
  closed: boolean
  time_in_trade: number
  trade_ids: number[]
  starting_time: number
}
