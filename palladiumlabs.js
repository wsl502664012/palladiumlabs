import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config(); // Load variabel dari .env

// Provider & Wallet dari .env
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Proxy Contract Address
const proxyAddress = process.env.PROXY_ADDRESS;

// ABI dari Implementation Contract untuk Method provideToSP
const iface = new ethers.Interface([
    "function provideToSP(uint256 _amount, address[] _assets)"
]);
// ABI dari Implementation Contract untuk Method withdrawFromSP
const ifacewithdraw = new ethers.Interface([
    "function withdrawFromSP(uint256 _amount, address[] _assets)"
]);

// Fungsi untuk amount acak
const randomAmount = (min, max, decimals) => {
    const factor = ethers.parseUnits("1", decimals); // Konversi ke desimal yang sesuai
    const randomValue = (Math.random() * (max - min) + min).toFixed(decimals);
    return ethers.parseUnits(randomValue, decimals);
};

// Encode Data
const amount = randomAmount(0.5, 1, 18);
const assets = [
    "0x321f90864fb21cdcddD0D67FE5e4Cbc812eC9e64",
    "0xFE38CACa0D06EA8D42A88E3AE1535Aa34F592bC2"
];

// Encode function call
const data = iface.encodeFunctionData("provideToSP", [amount, assets]);
const datawithdraw = ifacewithdraw.encodeFunctionData("withdrawFromSP", [amount, assets]);
// Kirim transaksi ke proxy
async function callProvideToSP() {
    try {
        console.log("From:", await wallet.getAddress()); // Pastikan address terlihat

        console.log("To:", proxyAddress);

        const balance = await provider.getBalance(wallet.address);
        console.log("Wallet Balance:", ethers.formatEther(balance), "BTC");

        console.log("Amount:", ethers.formatUnits(amount, 18)); // Menampilkan nilai asli dalam format desimal

        // Ambil harga gas
        const gasPrice = (await provider.getFeeData()).gasPrice
        const gasLimit = "1596932";


        console.log("Raw Gas Price:", gasPrice.toString());

        // Pastikan gasPrice dapat diformat
        const gasPriceFormatted = ethers.formatUnits(gasPrice, 'gwei');
        console.log("Gas Price (in Gwei):", gasPriceFormatted);

        // Kirim transaksi
        const tx = await wallet.sendTransaction({
            to: proxyAddress,
            data: data,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
        });

        console.log("Transaction sent! Hash:", tx.hash);

        // Tunggu transaksi terkonfirmasi
        await tx.wait();
        console.log("Transaction confirmed!");

        console.log("=========================================================\n\n")

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}
// Kirim transaksi ke proxy
async function callWithdrawToSP() {
    try {
        console.log("From:", await wallet.getAddress()); // Pastikan address terlihat

        console.log("To:", proxyAddress);

        const balance = await provider.getBalance(wallet.address);
        console.log("Wallet Balance:", ethers.formatEther(balance), "BTC");

        console.log("Amount:", ethers.formatUnits(amount, 18)); // Menampilkan nilai asli dalam format desimal

        // Ambil harga gas
        const gasPrice = (await provider.getFeeData()).gasPrice
        const gasLimit = "1596932";


        console.log("Raw Gas Price:", gasPrice.toString());

        // Pastikan gasPrice dapat diformat
        const gasPriceFormatted = ethers.formatUnits(gasPrice, 'gwei');
        console.log("Gas Price (in Gwei):", gasPriceFormatted);

        // Kirim transaksi
        const tx = await wallet.sendTransaction({
            to: proxyAddress,
            data: datawithdraw,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
        });

        console.log("Transaction sent! Hash:", tx.hash);

        // Tunggu transaksi terkonfirmasi
        await tx.wait();
        console.log("Transaction confirmed!");

        console.log("=========================================================\n\n")

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}
// Fungsi untuk delay acak
function delay(min, max) {
    // Menghasilkan waktu acak antara min dan max dalam detik
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`Waiting for ${time} seconds before next transaction...\n`);
    return new Promise(resolve => setTimeout(resolve, time * 1000)); // Waktu dalam detik
}

// Fungsi untuk melakukan multiple transaksi kali
async function sendMultipleTransactions() {
    const maxTransaction = 1000;

    for (let i = 0; i < maxTransaction; i++) {

        console.log("=========================================================");
        console.log(`Send Transaction to provideToSP() ${i + 1} of ${maxTransaction}...`);
        console.log("=========================================================");
        await callProvideToSP();

        const minDelay = 5; // Detik
        const maxDelay = 15; // Detik
        await delay(minDelay, maxDelay);

        console.log("=========================================================");
        console.log(`Send Transaction to callWithdrawToSP() ${i + 1} of ${maxTransaction}...`);
        console.log("=========================================================");
        await callWithdrawToSP();

        const dayminDelay = 4 * 3600 + 5; // Detik
        const daymaxDelay = 5 * 3600 + 15; // Detik
        await delay(dayminDelay, daymaxDelay);
    }
}

sendMultipleTransactions();
