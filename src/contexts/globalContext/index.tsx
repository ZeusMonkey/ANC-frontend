import { ConnectWalletModal, LoadingModal } from "components";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import React, { useEffect, useState } from "react";
import { EthSenderService } from "services/ethSender";
import { RegistryService } from "services/registry";
import { Maybe } from "types";

export interface IGlobalData {
  walletConnectModalOpened: boolean;
  isLoading: boolean;
  loadingText: string;
  ethSenderService: Maybe<EthSenderService>;
  registryService: Maybe<RegistryService>;
}

export interface IGlobalDefaultData extends IGlobalData {
  toggleWalletConnectModal: () => void;
  setLoading: (loading: boolean, loadingText?: string) => void;
}

const GlobalContext = React.createContext<IGlobalDefaultData>({
  walletConnectModalOpened: false,
  toggleWalletConnectModal: () => {},
  isLoading: false,
  loadingText: "",
  ethSenderService: null,
  registryService: null,
  setLoading: () => {},
});

export const useGlobal = () => {
  const context = React.useContext(GlobalContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const GlobalProvider = (props: IProps) => {
  const [state, setState] = useState<IGlobalData>({
    walletConnectModalOpened: false,
    isLoading: false,
    loadingText: "",
    ethSenderService: null,
    registryService: null,
  });
  const { account, library: provider, networkId } = useConnectedWeb3Context();

  const loadAllData = async () => {
    if (networkId) {
      setState((prevState) => ({
        ...prevState,
        ethSenderService: new EthSenderService(
          provider,
          account,
          getContractAddress(networkId, "ethSender")
        ),
        registryService: new RegistryService(
          provider,
          account,
          getContractAddress(networkId, "registry")
        ),
      }));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    loadAllData()
  }, [networkId, account, provider]);

  const toggleWalletConnectModal = () => {
    setState((prevState) => ({
      ...prevState,
      walletConnectModalOpened: !prevState.walletConnectModalOpened,
    }));
  };

  const setLoading = (loading: boolean, loadingText?: string) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: loading,
      loadingText: loadingText || "",
    }));
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        toggleWalletConnectModal,
        setLoading,
      }}
    >
      {props.children}
      {state.walletConnectModalOpened && (
        <ConnectWalletModal
          onClose={toggleWalletConnectModal}
          visible={state.walletConnectModalOpened}
        />
      )}
      {state.isLoading && (
        <LoadingModal
          onClose={() => setLoading(false)}
          text={state.loadingText}
          visible={state.isLoading}
        />
      )}
    </GlobalContext.Provider>
  );
};
