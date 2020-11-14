import tradeUtils from './tradeUtils'

describe('tradeUtils', () => {
  describe('calculateSlippage', () => {
    it('should calculate slippage well', () => {
      expect(tradeUtils.calculateSlippage('1000', '10000').toNumber()).toBe(90)
    })
  })
})
