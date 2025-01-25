"use client"

import type React from "react"
import { useState } from "react"
import { MiniKit, tokenToDecimals, Tokens, type PayCommandInput } from "@worldcoin/minikit-js"
import { motion } from "framer-motion"

const sendPayment = async (amount: number, token: Tokens) => {
  try {
    const res = await fetch(`/api/initiate-payment`, {
      method: "POST",
    })

    const { id } = await res.json()
    console.log(id)

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
    }

    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload)
    }
    return null
  } catch (error: unknown) {
    console.log("Error sending payment", error)
    return null
  }
}

const handlePay = async (amount: number, token: Tokens) => {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed")
    return
  }
  const sendPaymentResponse = await sendPayment(amount, token)
  const response = sendPaymentResponse?.finalPayload
  if (!response) {
    return
  }

  if (response.status == "success") {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: response }),
    })
    const payment = await res.json()
    if (payment.success) {
      console.log("SUCCESS!")
    } else {
      console.log("FAILED!")
    }
  }
}

export const PayBlock = () => {
  const [amount, setAmount] = useState(0.0)
  const [token, setToken] = useState<Tokens>(Tokens.WLD)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number.parseFloat(e.target.value))
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToken(e.target.value === "USDC" ? Tokens.USDCE : Tokens.WLD)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Make a Payment</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-400 mb-1">
            Token
          </label>
          <select
            id="token"
            value={token === Tokens.USDCE ? "USDC" : "WLD"}
            onChange={handleTokenChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="WLD">WLD</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
          onClick={() => handlePay(amount, token)}
        >
          Pay Now
        </motion.button>
      </div>
    </motion.div>
  )
}
