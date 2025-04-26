import axios from 'axios';
const hexResult = '0x185e04';
const gasEstimate = parseInt(hexResult, 16);
console.log(gasEstimate); // Ini akan memberikan hasil dalam desimal


async function checkConnection() {
    const data = {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1
    };

    try {
        const response = await axios.post('https://node.botanixlabs.dev', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Response from RPC:", response.data);
    } catch (error) {
        console.error("Error connecting to RPC:", error);
    }
}

checkConnection();

