import { BigNumber } from "ethers";

export type Maybe<T> = T | null;

export type NetworkId = 3;

export type KnownContract = "ethSender" | "registry";

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    [key in KnownContract]: string;
  };
}
