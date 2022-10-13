import { sign } from 'crypto';
import nacl from 'tweetnacl';
import { WalletVerifyParams } from './common';

export class AptosVerifier {

    public static fromObj(param: WalletVerifyParams) : AptosVerifier {
        return new AptosVerifier(param);
    }

    private constructor(readonly verifyParam: WalletVerifyParams) {}

    toString(): string {
        return `${this.verifyParam.raw}-${this.verifyParam.inviteCode}-${this.verifyParam.type}`;
    }

    verifySignature(): boolean {
        const message = this.toString();

        let key = this.verifyParam.wallet;
        if (key.startsWith('0x') || key.startsWith('0X')) key = key.substring(2);

        let signature = this.verifyParam.signature;
        if (signature.startsWith('0x') || signature.startsWith('0X')) signature = signature.substring(2);

        return nacl.sign.detached.verify(
                Buffer.from(message),
                Buffer.from(signature, 'hex'),
                Buffer.from(key, 'hex')
        );
    }
}