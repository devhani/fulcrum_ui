import { ProviderType } from "../domain/ProviderType";
import { TorqueProvider } from "../services/TorqueProvider";

export enum WalletType {
  Web3 = "Web3", // "w" abbreviation
  NonWeb3 = "NonWeb3", // "n" abbreviation
  ViewOnly = "ViewOnly", // "v" abbreviation
  Unknown = "Unknown"
}

export const walletTypeToWalletTypeAbbr = (walletType: WalletType): string => {
  return "w"
  return walletType === WalletType.Web3 ? "w" : walletType === WalletType.NonWeb3 ? "n" : "";
};

export const walletTypeAbbrToWalletType = (walletTypeAbbr: string): WalletType => {
  return TorqueProvider.Instance.providerType !== ProviderType.None ?
          WalletType.Web3 :
          WalletType.ViewOnly;
  switch (walletTypeAbbr) {
    case "w":
      return WalletType.Web3;
    case "n":
      return WalletType.NonWeb3;
    case "v":
        return WalletType.ViewOnly;
    default:
      return WalletType.Unknown
  }
};
