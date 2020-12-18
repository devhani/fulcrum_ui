import * as mobx from 'mobx'
import { StakingProvider } from 'src/services/StakingProvider'
import StakingStore from './StakingStore'
import UIStore from './UIStore'
import Web3Connexion from './Web3Connexion'

type rootStoreProp = 'providerIsChanging'

export default class RootStore {
  public stakingStore: StakingStore
  public stakingProvider: StakingProvider
  public web3Connexion: Web3Connexion
  public uiStore: UIStore
  public providerIsChanging = false
  public etherscanURL = ''

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: rootStoreProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public init() {
    const sp = this.stakingProvider
    sp.on('ProviderIsChanging', () => {
      this.set('providerIsChanging', true)
    })
    sp.on('ProviderChanged', (event) => {
      this.assign({
        providerIsChanging: false,
        etherscanURL: sp.web3ProviderSettings ? sp.web3ProviderSettings.etherscanURL : ''
      })

      this.web3Connexion.assign({
        supportedNetwork: !sp.unsupportedNetwork,
        providerType: event.providerType,
        walletAddress: sp.getCurrentAccount() || ''
      })
    })
    this.stakingStore.init()
  }

  constructor({ stakingProvider }: { stakingProvider: StakingProvider }) {
    this.stakingProvider = stakingProvider
    this.stakingStore = new StakingStore(this)
    this.web3Connexion = new Web3Connexion(this)
    this.uiStore = new UIStore(this)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
