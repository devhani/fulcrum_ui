import React from 'react'

export default function Loader (props) {
  const style = {width: props.width || '60%'}
  return (
    <div className="wrapper-loader" style={style}>
      <div className="container-loader">
        <div className="item-loader"></div>
      </div>
    </div>
  )
}
