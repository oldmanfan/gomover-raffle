import { ethers } from "ethers";
import { WalletVerifyParams } from "./common";

export class EvmVerifier {

    public static fromObj(param: WalletVerifyParams) : EvmVerifier {
        return new EvmVerifier(param);
    }

    private constructor(readonly verifyParam: WalletVerifyParams) {}

    toString(): string {
        return `${this.verifyParam.raw}-${this.verifyParam.inviteCode}-${this.verifyParam.type}`;
    }

    verifySignature(): boolean {
        const signer = ethers.utils.verifyMessage(this.toString(), this.verifyParam.signature);
        return signer === this.verifyParam.wallet;
    }
}
