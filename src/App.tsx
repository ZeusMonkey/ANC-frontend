import { Web3Provider } from "@ethersproject/providers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { ConnectedWeb3, GlobalProvider } from "contexts";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import routes, { renderRoutes } from "routes";
import { createTheme } from "theme";
import LuxonUTCUtils from "utils/LuxonUTCUtils";

import "./App.css";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MuiPickersUtilsProvider utils={LuxonUTCUtils}>
          <ConnectedWeb3>
            <GlobalProvider>
              <BrowserRouter>{renderRoutes(routes as any)}</BrowserRouter>
            </GlobalProvider>
          </ConnectedWeb3>
        </MuiPickersUtilsProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
