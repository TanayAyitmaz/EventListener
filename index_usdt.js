// Requirements
const ethers = require("ethers");
const arbiABI = require("./abis/tether.json");
require("dotenv").config();

// Main Function or You can give any function name.
async function main() {
  const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT Contract Address
  const provider = new ethers.providers.WebSocketProvider(
    `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}` // Alchemy Provider and your API-Key
  );

  let count = 0;
  let followValue = 5000;

  const contract = new ethers.Contract(contractAddress, arbiABI, provider);

  // We follow the Transfer Event in the transfer function.
  contract.on("Transfer", (from, to, value, event) => {
    let transferEvent = {
      from: from,
      to: to,
      value: value,
      eventData: event,
    };
    count++;

    // Parse JSON
    const obj = JSON.parse(JSON.stringify(transferEvent, null, 4));
    console.log(
      "Transaction Count: ",
      count,
      "\n - From: ",
      obj.from,
      "\n - To: ",
      obj.to
    );
    console.log(" - Value: ", parseInt(obj.value.hex) / 1e6);
    console.log(" - BlockNumber: ", obj.eventData.blockNumber);
    console.log(" - TransactionHash: ", obj.eventData.transactionHash);
    if (parseInt(obj.value.hex) / 1e6 > followValue) {
      console.log("A transfer greater than ", followValue, " USDT took place.");
    }
    console.log("-----");
  });
}

main();
