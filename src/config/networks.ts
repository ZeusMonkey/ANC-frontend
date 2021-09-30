import { INetwork, KnownContract, NetworkId } from "types";
import { entries } from "utils/type-utils";

import { INFURA_PROJECT_ID } from "./constants";

export const networkIds = {
  // MAINNET: 1,
  ROPSTEN: 3,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.ROPSTEN]: {
    label: "Ropsten",
    url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
    contracts: {
      ethSender: "0xfa0a8b60b2af537dec9832f72fd233e93e4c8463",
      registry: "0x3C901dc595105934D61DB70C2170D3a6834Cb8B7",
    },
  },
};

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string;
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
);

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined;
};

export const getEtherscanURL = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  if (networkId === 3) return "https://ropsten.etherscan.io";
  return "";
};

export const getContractAddress = (
  networkId: number,
  contract: KnownContract
): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return networks[networkId].contracts[contract];
};
