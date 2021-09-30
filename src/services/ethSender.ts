import { TransactionReceipt } from "@ethersproject/abstract-provider/lib/index";
import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::EthSender");

const ethSenderAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "time", type: "uint256" },
      { internalType: "address payable", name: "recipient", type: "address" },
    ],
    name: "sendEthAtTime",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

class EthSenderService {
  provider: any;
  contract: Contract;

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    ethSenderAddress: string
  ) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        ethSenderAddress,
        ethSenderAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(
        ethSenderAddress,
        ethSenderAbi,
        provider
      );
    }
  }

  get address(): string {
    return this.contract.address;
  }

  sendEthAtTime = async (
    time: number,
    recipient: string,
    value: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.sendEthAtTime(
      time,
      recipient,
      { value }
    );
    logger.log(`sendEthAtTime transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  static encodeSendEthAtTime = (time: number, recipient: string): string => {
    const ethSenderInterface = new utils.Interface(ethSenderAbi);
    return ethSenderInterface.encodeFunctionData("sendEthAtTime", [
      time,
      recipient,
    ]);
  };
}

export { EthSenderService };
