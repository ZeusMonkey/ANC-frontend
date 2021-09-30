import { TransactionReceipt } from "@ethersproject/abstract-provider/lib/index";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Registry");

const registryAbi = [
  {
    inputs: [
      {
        internalType: "contract IStakeManager",
        name: "stakeMan",
        type: "address",
      },
      { internalType: "contract IOracle", name: "oracle", type: "address" },
      {
        internalType: "contract IForwarder",
        name: "userForwarder",
        type: "address",
      },
      {
        internalType: "contract IForwarder",
        name: "gasForwarder",
        type: "address",
      },
      {
        internalType: "contract IForwarder",
        name: "userGasForwarder",
        type: "address",
      },
      { internalType: "string", name: "tokenName", type: "string" },
      { internalType: "string", name: "tokenSymbol", type: "string" },
      { internalType: "uint256", name: "totalAUTOSupply", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address payable",
        name: "referer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "initEthSent",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "ethForCall",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "verifyUser",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "insertFeeAmount",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "payWithAUTO",
        type: "bool",
      },
      { indexed: false, internalType: "bool", name: "isAlive", type: "bool" },
    ],
    name: "HashedReqAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "HashedReqCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "bool",
        name: "wasRemoved",
        type: "bool",
      },
    ],
    name: "HashedReqExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "HashedReqUnveriAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "HashedReqUnveriCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "bool",
        name: "wasRemoved",
        type: "bool",
      },
    ],
    name: "HashedReqUnveriExecuted",
    type: "event",
  },
  {
    inputs: [],
    name: "BASE_BPS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GAS_OVERHEAD_AUTO",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GAS_OVERHEAD_ETH",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAY_AUTO_BPS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAY_ETH_BPS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      {
        components: [
          { internalType: "address payable", name: "user", type: "address" },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "address payable", name: "referer", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint112", name: "initEthSent", type: "uint112" },
          { internalType: "uint112", name: "ethForCall", type: "uint112" },
          { internalType: "bool", name: "verifyUser", type: "bool" },
          { internalType: "bool", name: "insertFeeAmount", type: "bool" },
          { internalType: "bool", name: "payWithAUTO", type: "bool" },
          { internalType: "bool", name: "isAlive", type: "bool" },
        ],
        internalType: "struct IRegistry.Request",
        name: "r",
        type: "tuple",
      },
    ],
    name: "cancelHashedReq",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      {
        components: [
          { internalType: "address payable", name: "user", type: "address" },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "address payable", name: "referer", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint112", name: "initEthSent", type: "uint112" },
          { internalType: "uint112", name: "ethForCall", type: "uint112" },
          { internalType: "bool", name: "verifyUser", type: "bool" },
          { internalType: "bool", name: "insertFeeAmount", type: "bool" },
          { internalType: "bool", name: "payWithAUTO", type: "bool" },
          { internalType: "bool", name: "isAlive", type: "bool" },
        ],
        internalType: "struct IRegistry.Request",
        name: "r",
        type: "tuple",
      },
      { internalType: "bytes", name: "dataPrefix", type: "bytes" },
      { internalType: "bytes", name: "dataSuffix", type: "bytes" },
    ],
    name: "cancelHashedReqUnveri",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      {
        components: [
          { internalType: "address payable", name: "user", type: "address" },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "address payable", name: "referer", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint112", name: "initEthSent", type: "uint112" },
          { internalType: "uint112", name: "ethForCall", type: "uint112" },
          { internalType: "bool", name: "verifyUser", type: "bool" },
          { internalType: "bool", name: "insertFeeAmount", type: "bool" },
          { internalType: "bool", name: "payWithAUTO", type: "bool" },
          { internalType: "bool", name: "isAlive", type: "bool" },
        ],
        internalType: "struct IRegistry.Request",
        name: "r",
        type: "tuple",
      },
      { internalType: "uint256", name: "expectedGas", type: "uint256" },
    ],
    name: "executeHashedReq",
    outputs: [{ internalType: "uint256", name: "gasUsed", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      {
        components: [
          { internalType: "address payable", name: "user", type: "address" },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "address payable", name: "referer", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint112", name: "initEthSent", type: "uint112" },
          { internalType: "uint112", name: "ethForCall", type: "uint112" },
          { internalType: "bool", name: "verifyUser", type: "bool" },
          { internalType: "bool", name: "insertFeeAmount", type: "bool" },
          { internalType: "bool", name: "payWithAUTO", type: "bool" },
          { internalType: "bool", name: "isAlive", type: "bool" },
        ],
        internalType: "struct IRegistry.Request",
        name: "r",
        type: "tuple",
      },
      { internalType: "bytes", name: "dataPrefix", type: "bytes" },
      { internalType: "bytes", name: "dataSuffix", type: "bytes" },
      { internalType: "uint256", name: "expectedGas", type: "uint256" },
    ],
    name: "executeHashedReqUnveri",
    outputs: [{ internalType: "uint256", name: "gasUsed", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAUTOAddr",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "getExecCountOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGasForwarder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "r", type: "bytes" },
      { internalType: "bytes", name: "dataPrefix", type: "bytes" },
      { internalType: "bytes", name: "dataPostfix", type: "bytes" },
    ],
    name: "getHashedIpfsReq",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getHashedReq",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getHashedReqUnveri",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHashedReqs",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHashedReqsLen",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "startIdx", type: "uint256" },
      { internalType: "uint256", name: "endIdx", type: "uint256" },
    ],
    name: "getHashedReqsSlice",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHashedReqsUnveri",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHashedReqsUnveriLen",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "startIdx", type: "uint256" },
      { internalType: "uint256", name: "endIdx", type: "uint256" },
    ],
    name: "getHashedReqsUnveriSlice",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "r", type: "bytes" },
      { internalType: "bytes", name: "dataPrefix", type: "bytes" },
      { internalType: "bytes", name: "dataPostfix", type: "bytes" },
    ],
    name: "getIpfsReqBytes",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getOracle",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "getReferalCountOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address payable", name: "user", type: "address" },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "address payable", name: "referer", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint112", name: "initEthSent", type: "uint112" },
          { internalType: "uint112", name: "ethForCall", type: "uint112" },
          { internalType: "bool", name: "verifyUser", type: "bool" },
          { internalType: "bool", name: "insertFeeAmount", type: "bool" },
          { internalType: "bool", name: "payWithAUTO", type: "bool" },
          { internalType: "bool", name: "isAlive", type: "bool" },
        ],
        internalType: "struct IRegistry.Request",
        name: "r",
        type: "tuple",
      },
    ],
    name: "getReqBytes",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "getReqCountOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "rBytes", type: "bytes" }],
    name: "getReqFromBytes",
    outputs: [
      {
        components: [
          { internalType: "address payable", name: "user", type: "address" },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "address payable", name: "referer", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint112", name: "initEthSent", type: "uint112" },
          { internalType: "uint112", name: "ethForCall", type: "uint112" },
          { internalType: "bool", name: "verifyUser", type: "bool" },
          { internalType: "bool", name: "insertFeeAmount", type: "bool" },
          { internalType: "bool", name: "payWithAUTO", type: "bool" },
          { internalType: "bool", name: "isAlive", type: "bool" },
        ],
        internalType: "struct IRegistry.Request",
        name: "r",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakeManager",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserForwarder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserGasForwarder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "callData", type: "bytes" },
      { internalType: "uint256", name: "expectedGas", type: "uint256" },
      { internalType: "uint256", name: "startIdx", type: "uint256" },
    ],
    name: "insertToCallData",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "hashedIpfsReq", type: "bytes32" },
    ],
    name: "newHashedReqUnveri",
    outputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "target", type: "address" },
      { internalType: "address payable", name: "referer", type: "address" },
      { internalType: "bytes", name: "callData", type: "bytes" },
      { internalType: "uint112", name: "ethForCall", type: "uint112" },
      { internalType: "bool", name: "verifyUser", type: "bool" },
      { internalType: "bool", name: "insertFeeAmount", type: "bool" },
      { internalType: "bool", name: "isAlive", type: "bool" },
    ],
    name: "newReq",
    outputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "target", type: "address" },
      { internalType: "address payable", name: "referer", type: "address" },
      { internalType: "bytes", name: "callData", type: "bytes" },
      { internalType: "uint112", name: "ethForCall", type: "uint112" },
      { internalType: "bool", name: "verifyUser", type: "bool" },
      { internalType: "bool", name: "insertFeeAmount", type: "bool" },
      { internalType: "bool", name: "payWithAUTO", type: "bool" },
      { internalType: "bool", name: "isAlive", type: "bool" },
    ],
    name: "newReqPaySpecific",
    outputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

class RegistryService {
  provider: any;
  contract: Contract;

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    registryAddress: string
  ) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        registryAddress,
        registryAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(
        registryAddress,
        registryAbi,
        provider
      );
    }
  }

  get address(): string {
    return this.contract.address;
  }

  newReq = async (
    target: string,
    referer: string,
    callData: string,
    ethForCall: BigNumber,
    verifyUser: boolean,
    insertFeeAmount: boolean,
    isAlive: boolean,
    value: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.newReq(
      target,
      referer,
      callData,
      ethForCall,
      verifyUser,
      insertFeeAmount,
      isAlive,
      { value, gasLimit: BigNumber.from(500000) }
    );
    logger.log(`newReq transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  estimateGas = async (
    methodName: string,
    args: any[],
    value?: BigNumber
  ): Promise<BigNumber> => {
    return this.contract.estimateGas[methodName](...args, {
      value: value || "0x0",
    });
  };
}

export { RegistryService };
