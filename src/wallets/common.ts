
export const EvmWalletType: string = 'evm';
export const AptosWalletType: string = 'aptos';

export type WalletType = 'evm' | 'aptos';

export interface WalletVerifyParams {
    raw: string;
    wallet: string;
    type: WalletType;
    signature: string;
}
