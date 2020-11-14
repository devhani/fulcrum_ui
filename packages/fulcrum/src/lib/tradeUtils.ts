import { BigNumber } from '@0x/utils'

/**
 * @param oneTokenRate expected rate for 1 unit of srcToken
 * @param tradeAmountRate expected rate of actual amount
 */
export function calculateSlippage(oneTokenRate: string, tradeAmountRate: string): BigNumber {
  return new BigNumber(oneTokenRate)
    .minus(tradeAmountRate)
    .abs()
    .div(tradeAmountRate)
    .times(100)
}

export default {
  calculateSlippage
}
