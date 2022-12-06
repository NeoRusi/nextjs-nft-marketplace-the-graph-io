const Moralis = require("moralis/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")
let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddress = contractAddresses[chainId]["NFTMarketplace"][0]

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const masterKey = process.env.masterKey
async function main() {
    await Morali.start({ serverUrl, appId, masterKey })
    console.log(`Working with contract address ${contractAddress}`)
    let itemListedOptions = {
        //Moralis understands a local chain is 1337
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    }
    let ItemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemBought(address, address, uint256, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    }
    let ItemCanceledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemCanceled(address, address, uint256)",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        tableName: "ItemCanceled",
    }
    const listedResponse = await Morlalis.Cloud.run("watchContractEvent", ItemListedOptions, {
        useMasterKey: true,
    })
    const boughtResponce = await Moralis.Cloud.run("watchContractEvent", ItemBoughtOptions, {
        useMasterKey: true,
    })
    const canceledResponce = await Moralis.Cloud.run("watchContractEvent", ItemCanceledOptions, {
        useMasterKey: true,
    })
    if (listedResponse.success && canceledResponce.success && boughtResponce.success) {
        console.log("Success! Database updated! with watching events")
    } else {
        console.log("Something went wrong...")
    }
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
