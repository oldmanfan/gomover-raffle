import { Wallet } from "ethers";
import { BindForm, BindFormUtils } from "./wallets/bind-form"

// {
//     "address": "0x186d3e2402e74cd62a93163f6e520ffb803dd249",
//     "privateKey": "0xc51a31cb688bf1f19799ca3f2f9fa772649d98b3374a7c4d6326f98529fd92a6"
//   }

const privateKey = '0xc51a31cb688bf1f19799ca3f2f9fa772649d98b3374a7c4d6326f98529fd92a6';

async function main() {
    let form = {
        "keyWallet": "0x186d3e2402e74cd62A93163f6e520FFb803DD249",
        "invitedCode": "",
        "twitter": "1",
        "discord": "2",
        "evmWallets": [
            "3"
        ],
        "aptWallets": [
            "4",
            "5"
        ],
        "signature": ""
    } as BindForm;

    let utils = new BindFormUtils(form);

    let hash = utils.hash();

    let wallet = new Wallet(privateKey);

    let signature = await wallet.signMessage(hash);

    console.log(`hash: ${hash},  signature: ${signature}`);

    utils.form.signature = signature;

    const verify = utils.verifySignature();
    console.log(`verify: ${verify}`);
}

main();