export interface HyperliquidTrade {
  coin: string
  dir: string
  oid: number
  px: string
  sz: string
  crossed: boolean
  side: string
  time: string
  fee: string
  feeToken: string
  closedPnl: string
  tid?: string
  hash?: string
  builderFee?: string
  startPosition?: string
}

export interface DBTrade {
  coin: string
  dir: string
  oid: number
  px: number
  sz: number
  side: string
  time: number
  fee: number
  feeToken: string
  closedPnl?: number
  user_id: string
  crossed: boolean
  closeSize?: number
  trade_ids?: number[]
}

export interface Position {
  id: number
  coin: string
  px: number
  sz: number
  side: string
  dir: string
  closedPnl: number
  fee: number
  feeToken: string
  comments?: string
  remaining_size?: number | undefined
  all_trades?: DBTrade[]
  close_time: number
  dollar_size: number
  closed: boolean
  time_in_trade: number
  trade_ids: number[]
  starting_time?: number
  image_url?: string
}
