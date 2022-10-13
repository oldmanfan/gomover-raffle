import { WalletType } from "../wallets";



export interface UserProfile {
    wallet: string;   // 主wallet, 注册账号时首次使用, 为EVM账号
    type: WalletType;
    twitter: string;  // twitter账号
    discord: string;  // discord账号

    inviteCode: string; // 生成的邀请码, 可供其它人使用
    invitedUser: number; // 已经邀请了多少人

    totalPoints:  number; // 获得的总points
}

export function DbArray2UserArray(rows: any[][]): UserProfile[] {
    let arr: UserProfile[] = [];
    for (let it of rows) {
        arr.push({
            wallet: it[1],
            type: it[2],
            twitter: it[3],
            discord: it[4],
            inviteCode: it[5],
            invitedUser: it[6],
            totalPoints: it[7]
        });
    }

    return arr;
}

