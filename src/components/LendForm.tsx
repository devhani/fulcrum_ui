import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import FulcrumProvider from "../services/FulcrumProvider";

export interface ILendFormProps {
  lendType: LendType;
  asset: Asset;

  onSubmit: (request: LendRequest) => void;
  onCancel: () => void;
}

interface ILendFormState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;

  lendAmountText: string;
  lendAmount: BigNumber;

  lendedAmountEstimate: BigNumber;
}

export class LendForm extends Component<ILendFormProps, ILendFormState> {
  private _input: HTMLInputElement | null = null;

  constructor(props: ILendFormProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const interestRate = FulcrumProvider.getTokenInterestRate(props.asset);
    const maxLendValue = FulcrumProvider.getMaxLendValue(props.lendType, props.asset);
    const lendedAmountEstimate = FulcrumProvider.getLendedAmountEstimate(
      new LendRequest(props.lendType, props.asset, maxLendValue)
    );

    this.state = {
      lendAmountText: maxLendValue.toFixed(),
      lendAmount: maxLendValue,
      lendedAmountEstimate: lendedAmountEstimate,
      assetDetails: assetDetails || null,
      interestRate: interestRate
    };
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public componentDidMount(): void {
    if (this._input) {
      this._input.select();
      this._input.focus();
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const divStyle = {
      backgroundImage: `url(${this.state.assetDetails.bgSvg})`
    };

    const submitClassName =
      this.props.lendType === LendType.LEND ? "lend-form__submit-button--lend" : "lend-form__submit-button--un-lend";
    const tokenNameBase = this.state.assetDetails.displayName;
    const tokenNamePosition = `i${this.state.assetDetails.displayName}`;

    const tokenNameSource = this.props.lendType === LendType.LEND ? tokenNameBase : tokenNamePosition;
    const tokenNameDestination = this.props.lendType === LendType.LEND ? tokenNamePosition : tokenNameBase;

    return (
      <form className="lend-form" onSubmit={this.onSubmitClick}>
        <div className="lend-form__image" style={divStyle}>
          <img src={this.state.assetDetails.logoSvg} alt={tokenNameSource} />
        </div>
        <div className="lend-form__form-container">
          <div className="lend-form__form-values-container">
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Token</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Interest rate</div>
              <div className="lend-form__value">{`${this.state.interestRate.toFixed()}%`}</div>
            </div>
            <div className="lend-form__kv-container">
              <div className="lend-form__label">Amount</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <input
              type="text"
              ref={this._setInputRef}
              className="lend-form__amount"
              value={this.state.lendAmountText}
              onChange={this.onLendAmountChange}
            />
            <div className="lend-form__kv-container">
              <div className="lend-form__label lend-form__label--action" onClick={this.onInsertMaxValue}>
                Insert max value
              </div>
              <div className="lend-form__value lend-form__value--no-color">
                <span className="rounded-mark">?</span>
                &nbsp; {this.state.lendedAmountEstimate.toFixed(2)} {tokenNameDestination}
              </div>
            </div>
          </div>

          <div className="lend-form__actions-container">
            <button type="submit" className={`lend-form__submit-button ${submitClassName}`}>
              {this.props.lendType}
            </button>
            <button className="lend-form__cancel-button" onClick={this.onCancelClick}>
              <span className="lend-form__label--action">Cancel</span>
            </button>
          </div>
        </div>
      </form>
    );
  }

  public onLendAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    let amountText = event.target.value ? event.target.value : "";
    const amountTextForConversion = amountText === "" ? "0" : amountText;

    let amount = new BigNumber(amountTextForConversion);
    // handling negative values (incl. Ctrl+C)
    if (amount.isNegative()) {
      amountText = amount.absoluteValue().toFixed();
      amount = amount.absoluteValue();
    }

    // updating stored value only if the new input value is a valid number
    const lendedAmountEstimate = FulcrumProvider.getLendedAmountEstimate(
      new LendRequest(this.props.lendType, this.props.asset, amount)
    );
    if (!amount.isNaN()) {
      this.setState({
        ...this.state,
        lendAmountText: amountText,
        lendAmount: amount,
        lendedAmountEstimate: lendedAmountEstimate
      });
    }
  };

  public onInsertMaxValue = () => {
    if (!this.state.assetDetails) {
      return null;
    }

    const maxLendValue = FulcrumProvider.getMaxLendValue(this.props.lendType, this.props.asset);
    const lendedAmountEstimate = FulcrumProvider.getLendedAmountEstimate(
      new LendRequest(this.props.lendType, this.props.asset, maxLendValue)
    );
    this.setState({
      lendAmountText: maxLendValue.toFixed(),
      lendAmount: maxLendValue,
      lendedAmountEstimate: lendedAmountEstimate
    });
  };

  public onCancelClick = () => {
    this.props.onCancel();
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.lendAmount.isZero()) {
      if (this._input) {
        this._input.focus();
      }
      return;
    }

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.lendAmount.isPositive()) {
      this.props.onCancel();
      return;
    }

    this.props.onSubmit(new LendRequest(this.props.lendType, this.props.asset, this.state.lendAmount));
  };
}
