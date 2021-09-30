import { parseEther } from "@ethersproject/units";
import { Button, makeStyles } from "@material-ui/core";
import { FormTextField } from "components";
import { useGlobal } from "contexts";
import { BigNumber, ethers } from "ethers";
import React, { useState } from "react";
import { EthSenderService } from "services/ethSender";
import { Maybe } from "types";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    width: 400,
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: theme.spacing(1),
  },
  button: {
    margin: "auto",
    color: theme.colors.primary,
    width: "100%",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [time, setTime] = useState<Maybe<string>>(null);
  const [recipient, setRecipient] = useState<Maybe<string>>(null);
  const [amount, setAmount] = useState<Maybe<string>>(null);
  const { ethSenderService, registryService } = useGlobal();

  const isValidAddress = recipient ? ethers.utils.isAddress(recipient) : false;
  const timestamp = time ? new Date(time).getTime() : 0;
  const ethAmount = amount ? parseEther(amount) : BigNumber.from(0);
  const isValidReq =
    isValidAddress && timestamp > new Date().getTime() && ethAmount.gt(0);

  const newReq = async () => {
    if (!recipient || !timestamp || !registryService || !ethSenderService)
      return;

    const callData = EthSenderService.encodeSendEthAtTime(timestamp, recipient);
    try {
      await registryService.newReq(
        ethSenderService.address,
        "0x0000000000000000000000000000000000000000",
        callData,
        ethAmount,
        false,
        false,
        false,
        ethAmount.add(parseEther("0.01"))
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classes.root}>
      <FormTextField
        className={classes.input}
        label="Recipient Address"
        onChange={(e) => setRecipient(e)}
        value={recipient}
      />
      <FormTextField
        className={classes.input}
        defaultValue={time}
        label="Send Time"
        onChange={(e) => setTime(e)}
        type="datetime-local"
      />
      <FormTextField
        className={classes.input}
        label="Eth Amount"
        onChange={(e) => setAmount(e)}
        value={amount}
      />
      <Button
        className={classes.button}
        disabled={!isValidReq}
        onClick={newReq}
      >
        New Request
      </Button>
    </div>
  );
};

export default HomePage;
