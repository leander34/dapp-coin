'use client'

import { getBnbBalance, getTokenBalance, getTransaction, transferBnb, transferToken } from "@/services/meta-mask";
import { ethers } from "ethers";
import { FormEvent, useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState("BNB");
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');
  const [toAddress, setToAddress] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transaction, setTransaction] = useState("");
 
  async function handleCheckBalance(e: FormEvent) {
    e.preventDefault()

    let balance;
 
    if (contract === "BNB")
      balance = await getBnbBalance(address);
    else
      balance = await getTokenBalance(address, contract);
    setBalance(balance);

    setMessage(``);
  }

  async function handleTransfer(e: FormEvent) {
    e.preventDefault()
    let result;
    if (contract === "BNB")
      result = await transferBnb(toAddress, quantity);
    else
      result = await transferToken(toAddress, contract, quantity);
 
    setMessage(JSON.stringify(result));
  }

  async function handleCheckTransaction(e: FormEvent) {
  e.preventDefault()
console.log(transaction)
  const result = await getTransaction(transaction);

  console.log(result)

  if(!result) {
    setMessage('Não foi possível encontrar a transação.')
    return
  }
  setMessage(`
  Status: ${result.status}
  Confirmations: ${await result.confirmations()}`);
}
 
  return (
    <div className="p-3">
    <form onSubmit={handleCheckBalance} className="flex flex-col gap-2">
      <label htmlFor="">Address:</label>
        <input type="text" className="bg-zinc-700 text-white p-2 rounded-md shadow-sm" onChange={evt => setAddress(evt.target.value)} />
        <select className="bg-zinc-700 text-white p-2 rounded-md shadow-sm" onChange={evt => setContract(evt.target.value)}>
          <option value="BNB">BNB</option>
          <option value="0x53598858bC64f5f798B3AcB7F82FF2CB2aF463bf">BTC</option>
          <option value="0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378">ETH</option>
          <option value="0x64544969ed7EBf5f083679233325356EbE738930">USDC</option>
          <option value="0x25e600f7c19dacd81057a9b644784df9b3722daf">LELE</option>
        </select>
        <button type="submit" className="bg-emerald-500 rounded-md shadow-sm p-2">Connect</button>
    </form>
      
      <p className="my-3">
        Balance: {balance}
      </p>
      <hr />
      <p className="my-3">
        {message}
      </p>

      <form onSubmit={handleTransfer} className="flex flex-col gap-2 mb-4">
      <label htmlFor="">To address:</label>
        <input type="text" className="bg-zinc-700 text-white p-2 rounded-md shadow-sm" onChange={evt => setToAddress(evt.target.value)} />
        <input type="text" className="bg-zinc-700 text-white p-2 rounded-md shadow-sm" onChange={evt => setQuantity(evt.target.value)} />
        <button type="submit" className="bg-emerald-500 rounded-md shadow-sm p-2">Enviar</button>
    </form>

    <hr />

    <form onSubmit={handleCheckTransaction} className="flex flex-col gap-2 mt-4">
      <label htmlFor="">Hash da transação: </label>
      <input type="text" className="bg-zinc-700 text-white p-2 rounded-md shadow-sm" onChange={evt => setTransaction(evt.target.value)} />
      <button type="submit" className="bg-emerald-500 rounded-md shadow-sm p-2">Consultar transação</button>

    </form>
    </div >
  );
}
