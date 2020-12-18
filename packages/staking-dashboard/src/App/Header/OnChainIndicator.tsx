import { observer } from 'mobx-react'
import React from 'react'
import AppVM from '../AppVM'

export function OnChainIndicator({ appVM }: { appVM: AppVM }) {
  const { providerIsChanging, etherscanURL, web3Connexion } = appVM.rootStore
  const { providerTypeDetails, supportedNetwork, walletAddress } = web3Connexion
  const walletAddressText = supportedNetwork ? web3Connexion.shortWalletAddress : 'Wrong Network!'

  return (
    <div
      className={`on-chain-indicator ${providerTypeDetails !== null ? `connect` : 'disconnect'}`}>
      <button className="on-chain-indicator__container" onClick={appVM.providerMenu.show}>
        {providerIsChanging && (
          <span className="on-chain-indicator__provider-txt">Loading Wallet...</span>
        )}
        {!providerIsChanging &&
          providerTypeDetails !== null &&
          providerTypeDetails.reactLogoSvgShort !== null && (
            <React.Fragment>
              <div className="on-chain-indicator__svg">
                {providerTypeDetails.reactLogoSvgShort.render()}
              </div>
              <div className="on-chain-indicator__description">
                <span>{providerTypeDetails.displayName}</span>
                {walletAddressText ? (
                  supportedNetwork && walletAddress && etherscanURL ? (
                    <a
                      className="on-chain-indicator__wallet-address"
                      href={`${etherscanURL}address/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}>
                      {walletAddressText}
                    </a>
                  ) : (
                    <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
                  )
                ) : (
                  ``
                )}
              </div>
            </React.Fragment>
          )}
        {!providerIsChanging &&
          (providerTypeDetails === null || providerTypeDetails.reactLogoSvgShort === null) && (
            <React.Fragment>
              <span className="on-chain-indicator__provider-txt">Click To Connect Wallet</span>
              {!supportedNetwork ? (
                <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
              ) : (
                ``
              )}
            </React.Fragment>
          )}
      </button>
    </div>
  )
}

export default observer(OnChainIndicator)
