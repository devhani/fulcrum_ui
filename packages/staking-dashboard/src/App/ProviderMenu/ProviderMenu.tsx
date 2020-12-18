import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as CloseIcon } from 'app-images/ic__close.svg'
import { useEagerConnect, useInactiveListener } from 'app-lib/web3ReactHooks'
import React from 'react'
import Modal from 'react-modal'
import ProviderType from 'src/domain/ProviderType'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import ProviderMenuListItem from './ProviderMenuListItem'

export interface IProviderMenuProps {
  menuVisible: boolean
  providerTypes: ProviderType[]
  isMobileMedia: boolean
  onSelect: (selectedConnector: AbstractConnector, account?: string) => void
  onDeactivate: () => void
  onProviderMenuClose: () => void
}

export function ProviderMenu(props: IProviderMenuProps) {
  const context = useWeb3React()
  const { connector, activate, deactivate, active, error } = context
  const { onSelect } = props

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
      if (connector) {
        onSelect(connector)
      }
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  const disconnect = () => {
    deactivate()
    props.onDeactivate()
  }

  return (
    <Modal
      isOpen={props.menuVisible}
      onRequestClose={props.onProviderMenuClose}
      className="modal-content-div"
      overlayClassName="modal-overlay-div"
      ariaHideApp={false}>
      <div className="provider-menu">
        <div className="provider-menu__title">
          Select Wallet
          <div onClick={props.onProviderMenuClose}>
            <CloseIcon className="disclosure__close" />
          </div>
        </div>
        <div className="provider-menu__list">
          {props.providerTypes.map((providerType) => {
            const currentConnector = ProviderTypeDictionary.getConnectorByProviderType(providerType)
            const activating = currentConnector === activatingConnector
            const connected = currentConnector === connector
            const disabled = !triedEager || !!activatingConnector || connected || !!error
            return (
              <ProviderMenuListItem
                key={providerType}
                providerType={providerType}
                isConnected={connected}
                isActivating={activating}
                disabled={disabled}
                onSelect={() => {
                  if (currentConnector) {
                    setActivatingConnector(currentConnector)
                    activate(currentConnector).catch((err) => console.error(err))
                  }
                }}
              />
            )
          })}
        </div>
        <button type="button" className="disconnect" key={ProviderType.None} onClick={disconnect}>
          Disconnect
        </button>
      </div>
    </Modal>
  )
}

export default React.memo(ProviderMenu)
