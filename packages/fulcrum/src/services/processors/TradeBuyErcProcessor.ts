import { BigNumber } from "@0x/utils";
import { erc20Contract } from "../../contracts/erc20";
import { pTokenContract } from "../../contracts/pTokenContract";
import { Asset } from "../../domain/Asset";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { TradeTokenKey } from "../../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";
import { PositionType } from "../../domain/PositionType";

export class TradeBuyErcProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const isLong = taskRequest.positionType === PositionType.LONG;
    const decimals: number = AssetsDictionary.assets.get(taskRequest.collateral)!.decimals || 18;


    const loanToken = isLong
      ? taskRequest.collateral
      : taskRequest.asset;
    const depositToken = taskRequest.depositToken;
    const collateralToken = isLong
      ? taskRequest.asset
      : taskRequest.collateral;


    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));

    const tokenContract = await FulcrumProvider.Instance.contractsSource.getITokenContract(loanToken);
    if (!tokenContract) {
      throw new Error("No iToken contract available!");
    }

    let approvePromise: Promise<string> | null = null;

    // init erc20 contract for base token
    let tokenErc20Contract: erc20Contract | null = null;
    let assetErc20Address: string | null = "";
    let erc20allowance = new BigNumber(0);
    let txHash: string = "";
    let gasAmountBN;

    if (taskRequest.depositToken === Asset.WETH || taskRequest.depositToken === Asset.ETH) {
      task.processingStart([
        "Initializing",
        "Submitting trade",
        "Updating the blockchain",
        "Transaction completed"
      ]);

      assetErc20Address = "0x0000000000000000000000000000000000000000";

      // no additional inits or checks
      task.processingStepNext();
    } else {
      task.processingStart([
        "Initializing",
        "Detecting token allowance",
        "Prompting token allowance",
        "Waiting for token allowance",
        "Submitting trade",
        "Updating the blockchain",
        "Transaction completed"
      ]);

      assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(taskRequest.depositToken);
      if (assetErc20Address) {
        tokenErc20Contract = await FulcrumProvider.Instance.contractsSource.getErc20Contract(assetErc20Address);
      } else {
        throw new Error("No ERC20 contract available!");
      }

      if (!tokenErc20Contract) {
        throw new Error("No ERC20 contract available!");
      }
      task.processingStepNext();

      // Detecting token allowance
      erc20allowance = await tokenErc20Contract.allowance.callAsync(account, tokenContract.address);
      task.processingStepNext();
    }

    try {
      //FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Prompting token allowance
      if (amountInBaseUnits.gt(erc20allowance)) {
        approvePromise = tokenErc20Contract!.approve.sendTransactionAsync(tokenContract.address, FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS, { from: account });
      }
      task.processingStepNext();
      task.processingStepNext();
    }
    catch (e) {
      //console.log(e);
    }


    const leverageAmount = taskRequest.positionType === PositionType.LONG
      ? new BigNumber(taskRequest.leverage - 1).times(10 ** 18)
      : new BigNumber(taskRequest.leverage).times(10 ** 18);

    const loanTokenSent = depositToken === loanToken
      ? amountInBaseUnits
      : new BigNumber(0);

    const collateralTokenSent = depositToken === collateralToken
      ? amountInBaseUnits
      : new BigNumber(0);

    const depositTokenAddress = FulcrumProvider.Instance.getErc20AddressOfAsset(depositToken);
    const collateralTokenAddress = FulcrumProvider.Instance.getErc20AddressOfAsset(collateralToken);
    const loanData = "0x";

    try {
      const sendAmountForValue = taskRequest.depositToken === Asset.WETH || taskRequest.depositToken === Asset.ETH ?
        amountInBaseUnits :
        new BigNumber(0)

      // Waiting for token allowance
      if (approvePromise || skipGas) {
        await approvePromise;
        gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
      } else {
        // estimating gas amount
        let gasAmount;
        gasAmount = await tokenContract.marginTrade.estimateGasAsync(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          leverageAmount,
          loanTokenSent,
          collateralTokenSent,
          collateralTokenAddress!,
          account,
          loanData,
          {
            from: account,
            gas: FulcrumProvider.Instance.gasLimit,
            value: sendAmountForValue
          });

        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      }

      // Submitting trade
      txHash = await tokenContract.marginTrade.sendTransactionAsync(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress!,
        account,
        loanData,
        {
          from: account,
          gas: gasAmountBN.toString(),
          gasPrice: await FulcrumProvider.Instance.gasPrice(),
          value: sendAmountForValue
        });

      task.setTxHash(txHash);
    }
    catch (e) {
      throw e;
    }

    task.processingStepNext();
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash, task.request);
    if (!txReceipt.status) {
      throw new Error("Reverted by EVM");
    }

    task.processingStepNext();
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout);
  }
}
