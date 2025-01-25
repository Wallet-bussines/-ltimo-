"use client";

import React, { useState } from "react";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

const sendPayment = async (amount: number, token: Tokens) => {
  try {
    const res = await fetch(`/api/initiate-payment`, {
      method: "POST",
    });

    const { id } = await res.json();
    console.log(id);

    const payload: PayCommandInput = {
      reference: id,
      to: "0x512e4a7dda6b13f917d89fa782bdd7666dab1599", // Test address
      tokens: [
        {
          symbol: token,
          token_amount: tokenToDecimals(amount, token).toString(),
        },
      ],
      description: "Watch this is a test",
    };

    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload);
    }
    return null;
  } catch (error: unknown) {
    console.log("Error sending payment", error);
    return null;
  }
};

const handlePay = async (amount: number, token: Tokens) => {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed");
    return;
  }
  const sendPaymentResponse = await sendPayment(amount, token);
  const response = sendPaymentResponse?.finalPayload;
  if (!response) {
    return;
  }

  if (response.status == "success") {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: response }),
    });
    const payment = await res.json();
    if (payment.success) {
      console.log("SUCCESS!");
    } else {
      console.log("FAILED!");
    }
  }
};

export const PayBlock = () => {
  const [amount, setAmount] = useState(0.0);
  const [token, setToken] = useState<Tokens>(Tokens.WLD);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToken(e.target.value === "USDC" ? Tokens.USDCE : Tokens.WLD);
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        className="mb-2 p-2 border"
      />
      <select
        value={token === Tokens.USDCE ? "USDC" : "WLD"}
        onChange={handleTokenChange}
        className="mb-2 p-2 border"
      >
        <option value="WLD">WLD</option>
        <option value="USDC">USDC</option>
      </select>
      <button
        className="bg-blue-500 p-4"
        onClick={() => handlePay(amount, token)}
      >
        Pay
      </button>
    </div>
  );
};
