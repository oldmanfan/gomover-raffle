
import * as ethers from "ethers";

/**
 * 客户端获得signature的方式:
 *   1. 调用BindFormUtils.hash()方法, 获得一个hash字符串.
 *   2. 调用MetaMask方法的eth_sign方法, 获得signature.
 *   3. 将signature更新到BindForm的signature字段.
 */
export interface BindForm {
    keyWallet: string;
    invitedCode: string;
    twitter: string;
    discord: string;
    evmWallets: string[];
    aptWallets: string[];

    signature: string;
}

export class BindFormUtils {
    form: BindForm;

    constructor(_form: BindForm) {
        this.form = _form;
    }

    toString(): string {
        const f = this.form;
        return `${f.keyWallet}-${f.invitedCode}-${f.twitter}-${f.discord}-${f.evmWallets.join(",")}-${f.aptWallets.join(",")}`;
    }

    hash(): string {
        const bytes = ethers.utils.toUtf8Bytes(this.toString());
        return ethers.utils.hashMessage(bytes);
    }

    verifySignature(): boolean {
        const message = this.toString();
        const signer = ethers.utils.verifyMessage(message, this.form.signature);
        return signer === this.form.keyWallet;
    }
}
