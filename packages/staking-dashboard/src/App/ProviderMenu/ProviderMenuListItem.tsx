import { useWeb3React } from '@web3-react/core'
import React from 'react'
import ProviderType from 'src/domain/ProviderType'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import stakingProvider from 'src/services/StakingProvider'
import { Loader, ButtonBasic } from 'ui-framework'

export interface IProviderMenuListItemProps {
  disabled: boolean
  providerType: ProviderType
  isConnected: boolean
  isActivating: boolean
  onSelect: (providerType: ProviderType) => void
}

export function ProviderMenuListItem(props: IProviderMenuListItemProps) {
  const context = useWeb3React()
  const { account } = context

  const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(props.providerType) || null
  if (!providerTypeDetails) {
    return null
  }

  const onClick = () => {
    props.onSelect(props.providerType)
  }
  if (props.isConnected) {
    const isUnSupportedNetwork = stakingProvider.unsupportedNetwork

    const walletAddressText = isUnSupportedNetwork
      ? 'Wrong Network!'
      : account
      ? `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`
      : ''

    const etherscanURL = stakingProvider.web3ProviderSettings
      ? stakingProvider.web3ProviderSettings.etherscanURL
      : ''

    return (
      <ButtonBasic
        className="provider-menu__list-item provider-menu__list-item--selected"
        disabled={props.disabled}
        onClick={onClick}>
        <div className="provider-menu__list-item-description">
          <span className="provider-name">{providerTypeDetails.displayName}</span>
          {!isUnSupportedNetwork && account && etherscanURL ? (
            <a
              className="address"
              href={`${etherscanURL}address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}>
              {walletAddressText}
            </a>
          ) : (
            <span className="address">{walletAddressText}</span>
          )}
        </div>
        <div className="provider-menu__list-item-content-img">
          {providerTypeDetails.reactLogoSvgShort.render()}
        </div>
      </ButtonBasic>
    )
  }

  return (
    <ButtonBasic
      className="provider-menu__list-item"
      onClick={onClick}
      disabled={props.disabled}>
      <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
      <div className="provider-menu__list-item-content-img">
        {props.isActivating ? (
          <Loader quantityDots={3} sizeDots={'small'} title={''} isOverlay={false} />
        ) : (
          providerTypeDetails.reactLogoSvgShort.render()
        )}
      </div>
    </ButtonBasic>
  )
}

export default React.memo(ProviderMenuListItem)
