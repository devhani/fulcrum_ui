import { Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import Intercom from 'react-intercom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import appConfig from 'src/config/appConfig'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import AppVM from './AppVM'
import Footer from './Footer'
import Header from './Header'
import ProviderMenu from './ProviderMenu'
import Staking from './Staking'

export default function App({ vm }: { vm: AppVM }) {
  const { stakingProvider } = vm.rootStore
  return (
    <React.Fragment>
      <Web3ReactProvider getLibrary={stakingProvider.getLibrary}>
        <ProviderMenu
          menuVisible={vm.providerMenu.visible}
          providerTypes={ProviderTypeDictionary.WalletProviders}
          isMobileMedia={vm.rootStore.uiStore.media.smScreen}
          onSelect={stakingProvider.setWeb3Provider}
          onDeactivate={stakingProvider.deactivate}
          onProviderMenuClose={vm.providerMenu.hide}
        />
      </Web3ReactProvider>
      {appConfig.isMainnetProd ? <Intercom appID="dfk4n5ut" /> : null}
      <Router>
        <>
          <Header appVM={vm} />
          <Switch>
            <Route exact={true} path="/">
              <Staking />
            </Route>
          </Switch>
        </>
      </Router>
      <Footer />
    </React.Fragment>
  )
}
