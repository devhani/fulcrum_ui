import Loader from './Loader'
import React from 'react'
import PropTypes from 'prop-types'

const loader = <Loader />

/**
 * Common button loaded with extras
 *
 * `import {Button} from '@bzxnetwork/ui-framework'`
 */
export default function Button(props) {
  const { children, onClick, variant, isLoading, disabled, fullWidth } = props
  let cssClass = `btn--${variant}`

  fullWidth && (cssClass += ' block')
  isLoading && (cssClass += ' btn--loading')
  disabled && (cssClass += ' disabled')

  return (
    <button onClick={onClick} disabled={disabled} className={cssClass}>
      {isLoading ? loader : children}
    </button>
  )
}

Button.propTypes = {
  /**
   * Change appearance of the button.
   */
  variant: PropTypes.oneOf(['neutral', 'red', 'green', 'blue']),
  /**
   * Replace the button text by a loader.
   */
  isLoading: PropTypes.bool,
  /**
   * Disables the button.
   */
  disabled: PropTypes.bool,
  /**
   * Child nodes of the button (text / image)
   */
  children: PropTypes.node,
  /**
   * Make button take full width
   */
  fullWidth: PropTypes.bool
}

Button.defaultProps = {
  variant: 'neutral'
}
