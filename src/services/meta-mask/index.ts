import { ethers } from 'ethers';

const CONTRACT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function transfer(address to, uint amount)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
];
async function getMetaMaskProvider() {
    if (!window.ethereum) throw new Error(`No MetaMask found!`);
    await window.ethereum.send('eth_requestAccounts');
 
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) window.location.reload();
    });
    return provider;
}
 
export async function getBnbBalance(address: string) {
    const provider = await getMetaMaskProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance.toString());
}
 
export async function transferBnb(toAddress: string, quantity: string) {
    const provider = await getMetaMaskProvider();
    const signer = await provider.getSigner();
    ethers.getAddress(toAddress);//valida endereço
 
    const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(quantity)
    })
 
    return tx;
}

export async function getTokenBalance(address: string, contractAddress: string, decimals: number = 18) {
    const provider = await getMetaMaskProvider()
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
    const balance = await contract.balanceOf(address)
    return ethers.formatUnits(balance, decimals)
}

export async function transferToken(toAddress: string, contractAddress: string, quantity: string, decimals = 18) {
    const provider = await getMetaMaskProvider()
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
    const contractSigner = contract.connect(signer)
    ethers.getAddress(toAddress)
    const tx = await contractSigner.transfer(toAddress, ethers.parseUnits(quantity, decimals))
    return tx
}

export async function getTransaction(hash: string){
    const provider = await getMetaMaskProvider();
    const tx = await provider.getTransactionReceipt(hash);
    return tx;
}