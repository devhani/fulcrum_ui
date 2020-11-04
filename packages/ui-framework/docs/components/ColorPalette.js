import React from 'react'

/**
 * @typedef {object} ColorPaletteProps
 * @property {string} prop1
 */

const styles = {
  wrapper: {display: 'grid'},
  paletteItem: {textAlign: 'left'},
  box: {width: '80px', height: '80px', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}
}

const colors = [
  {variableName: '$color-black', hexCode: '#00003d', label: 'Black'},
  {variableName: '$color-blue', hexCode: '#53baff', label: 'Blue'},
  {variableName: '$color-gray-dark', hexCode: '#49413b', label: 'Shadow'},
  {variableName: '$color-gray-light', hexCode: '#edf1f7', label: 'Light gray'},
  {variableName: '$color-green', hexCode: '#2dc48a', label: 'Green'},
  {variableName: '$color-orange', hexCode: '#ff9d45', label: 'Orange'},
  {variableName: '$color-red', hexCode: '#ff6477', label: 'Red'},
]

const gradients = [
  {className: 'gradient--blue'},
  {className: 'gradient--orange'},
]

/**
 * @param {ColorPaletteProps} props
 */
export default function ColorPalette (props) {
  return (
    <div style={styles.wrapper} className="grid-fluid-colmin-10em">
      {colors.map((color) => {
        const style = Object.assign({backgroundColor: color.hexCode}, styles.box)
        return (
          <div key={color.hexCode} style={styles.paletteItem}>
            <div style={style}/>
            <div>
              {color.hexCode}
            </div>
            <div>
              {color.variableName}
            </div>
          </div>
        )
      })}
      {gradients.map((gradient) => {
        return (
          <div key={gradient.className} style={styles.paletteItem}>
            <div className={gradient.className} style={styles.box}/>
            <div>
              {`.${gradient.className}`}
            </div>
          </div>
        )
      })}
    </div>
  )
}
