import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'


export class EarnRewardEvent {
  public static readonly topic0: string =
    '0x7d67a06b653c0fa85ccea3aa013f859cf520653f6d581e121b77dc82a4c10412'
  public readonly reciever: string //indexed
  public readonly token: Asset //indexed
  public readonly loanId: string //indexed
  public amount: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string

  constructor(
    reciever: string,
    token: Asset,
    loanId: string,
    amount: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.reciever = reciever
    this.token = token
    this.loanId = loanId
    this.amount = amount
    this.timeStamp = timeStamp
    this.txHash = txHash
  }
}
