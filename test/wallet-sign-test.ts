import { Wallet } from "ethers";
import nacl from "tweetnacl";
import { EvmVerifier, WalletVerifyParams } from "../src/wallets";
import { AptosVerifier } from "../src/wallets/aptos-wallet";


async function verify_evm_signature() {
    // {
    //     "address": "0x186d3e2402e74cd62a93163f6e520ffb803dd249",
    //     "privateKey": "0xc51a31cb688bf1f19799ca3f2f9fa772649d98b3374a7c4d6326f98529fd92a6"
    //   }

    const privateKey = '0xc51a31cb688bf1f19799ca3f2f9fa772649d98b3374a7c4d6326f98529fd92a6';
    let params: WalletVerifyParams = {
        raw: "helloworld",
        wallet: "0x186d3e2402e74cd62A93163f6e520FFb803DD249",
        type: "evm",
        inviteCode: "ABEF87ED9087",
        signature: ""
    };

    let verifier = EvmVerifier.fromObj(params);
    let message = verifier.toString();

    let w = new Wallet(privateKey);
    let signature = await w.signMessage(message);

    verifier.verifyParam.signature = signature;

    let sigMatch = verifier.verifySignature();
    console.log(`evm signature check: ${sigMatch}`);
}

async function verify_aptos_signature() {
    var keys = nacl.sign.keyPair();

    let params: WalletVerifyParams = {
        raw: "helloworld",
        wallet: `0x${Buffer.from(keys.publicKey).toString('hex')}`,
        type: "aptos",
        inviteCode: "ABEF87ED9087",
        signature: ""
    };

    let verifier = AptosVerifier.fromObj(params);
    let message = verifier.toString();

    var signature = nacl.sign.detached(Buffer.from(message), keys.secretKey);

    // var result = nacl.sign.detached.verify(
    //     Buffer.from(message),
    //     Buffer.from(signature),
    //     keys.publicKey
    // );
    // console.log(`result: ${result}  publickey: ${Buffer.from(keys.publicKey).toString('hex')}`);

    verifier.verifyParam.signature = Buffer.from(signature).toString('hex');

    // console.log(`signature: ${verifier.verifyParam.signature}`);

    let sigMatch = verifier.verifySignature();
    console.log(`aptos signature check: ${sigMatch}`);
}

verify_evm_signature();
verify_aptos_signature();