import * as mobx from 'mobx'
import RootStore from 'src/stores/RootStore'
import ProviderTypeDetails from 'src/domain/ProviderTypeDetails'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import ProviderType from 'src/domain/ProviderType'
import hashUtils from 'app-lib/hashUtils'

type connectionStatusProp = 'supportedNetwork'

export default class Web3Connexion {
  public rootStore: RootStore
  public supportedNetwork = true
  public providerType: ProviderType = ProviderType.None
  public walletAddress: string = ''

  get shortWalletAddress() {
    return hashUtils.shortHash(this.walletAddress)
  }

  get providerTypeDetails(): ProviderTypeDetails | null {
    if (this.providerType !== ProviderType.None) {
      return ProviderTypeDictionary.providerTypes.get(this.providerType) || null
    }
    return null
  }

  get isConnected () {
    return this.providerType !== ProviderType.None && this.walletAddress
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: connectionStatusProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
