import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { SquarelinkConnector } from '@web3-react/squarelink-connector'
import { BitskiConnector } from '@web3-react/bitski-connector'
import { TorusConnector } from '@web3-react/torus-connector'

import configProviders from '../config/providers.json'
import { Web3ConnectionFactory } from './Web3ConnectionFactory'

const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    default:
      return 0
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK
const networkId = getNetworkIdByString(networkName)

const RPC_URL = Web3ConnectionFactory.getRPCUrl()

const POLLING_INTERVAL = 3600000

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 42] })

export const walletconnect = new WalletConnectConnector({
  rpc: { [networkId]: RPC_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URL,
  appName: 'bZx Stacking Dashboard '
})

export const ledger = new LedgerConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
  accountFetchingConfigs: {
    shouldAskForOnDeviceConfirmation: true,
    numAddressesToReturn: 100,
    addressSearchLimit: 1000
  }
})

export const trezor = new TrezorConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: 'hello@bzx.network',
  manifestAppUrl: window.location.origin,
  config: {
    networkId: networkId,
    accountFetchingConfigs: {
      shouldAskForOnDeviceConfirmation: true,
      numAddressesToReturn: 100,
      addressSearchLimit: 1000
    }
  }
})

export const authereum = new AuthereumConnector({ chainId: networkId })

export const fortmatic = new FortmaticConnector({
  apiKey: configProviders.Fortmatic_ApiKey as string,
  chainId: networkId
})

export const portis = new PortisConnector({
  dAppId: configProviders.Portis_DAppId as string,
  networks: [networkId]
})

export const squarelink = new SquarelinkConnector({
  clientId: configProviders.Squarelink_ClientId as string,
  networks: [networkId]
})

export const bitski = new BitskiConnector({
  clientId: configProviders.Bitski_ClientId as string,
  network: networkId,
  redirectUri: `${window.location.origin}/callback.html`
})

export const torus = new TorusConnector({
  chainId: networkId,
  constructorOptions: {
    buttonPosition: 'top-left' // default: bottom-left
  },
  initOptions: {
    buildEnv: 'production',
    enableLogging: false,
    network: {
      host: networkName || 'mainnet',
      chainId: networkId
    },
    showTorusButton: true
  }
})
