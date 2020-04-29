import React, { Component } from "react";

interface ILoaderProps {
  quantityDots: number,
  sizeDots: string,
  title: string,
  isOverlay: boolean,  
}

export class Loader extends Component<ILoaderProps> {
  public constructor(props: ILoaderProps, context?: any) {
    super(props, context);
  }
  public renderDots = () => {
    const animationDuration = 0.7 * this.props.quantityDots;
    let wrapperDots = [];
    for (var i = 0; i < this.props.quantityDots; i++) {
      wrapperDots.push(<span className={`${this.props.sizeDots}-dots`} style={{animationDuration : `${animationDuration}s`}}></span>)
    }
    return wrapperDots;
  }

  public render() {
    return (
      <div className={`loader ${this.props.isOverlay ? `loader-overlay` : ``}`}>
        <div className="loader-content">
          {this.props.title.length !== 0
            ? <p className={`loader-text loader-text-${this.props.sizeDots}`}>{this.props.title}</p>
            : null
          }
          <div className="loader-dots">
            {this.renderDots()}
          </div>
        </div>
      </div>
    );
  }
}