import { ethers } from "ethers";
import { WalletVerifyParams } from "./common";

export class EvmVerifier {

    public static fromObj(param: WalletVerifyParams) : EvmVerifier {
        return new EvmVerifier(param.raw, param.wallet, param.signature);
    }

    private constructor(readonly raw: string, readonly wallet: string, readonly signature: string) {}

    verifySignature(): boolean {
        const signer = ethers.utils.verifyMessage(this.raw, this.signature);
        return signer === this.wallet;
    }
}
