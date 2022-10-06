

export class RewardPoints {
    // 主动行为的奖励
    public static VERIFY_TWITTER: number                      = 10;
    public static JOIN_DISCORD: number                        = 10;
    public static CONNECT_APTOS_WALLET: number                = 20;
    public static CONNECT_EVM_WALLET_BY_APTOS_WALELT: number  = 30;
    public static CONNECT_2EVM_WALLET_BY_APTOS_WALLET: number = 40;
    // 邀请奖励
    public static BUNDLE_FOLLOW_TWITTER: number               = 20;
    public static BUNDLE_JOIN_DISCORD: number                 = 20;
    public static BUNDLE_CONNECT_WALLET: number               = 20;

    // 被邀请人有上述行为时, 发起邀请人的奖励
    public static INVITAT_USER: number                        = 5;
}
