import { AptosVerifier } from "./aptos-wallet";
import { AptosWalletType, EvmWalletType, WalletVerifyParams } from "./common";
import { EvmVerifier } from "./evm-wallet";

export function VerifyWalletSinagure(p: string): boolean {
    const verifyParam = JSON.parse(p) as WalletVerifyParams;

        if (verifyParam.type === EvmWalletType) {
            return EvmVerifier.fromObj(verifyParam).verifySignature();
        } else if (verifyParam.type === AptosWalletType) {
            return AptosVerifier.fromObj(verifyParam).verifySignature();
        }

        return false;
}

export * from "./evm-wallet";
export * from "./common";