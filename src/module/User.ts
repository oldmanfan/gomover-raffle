export interface User {
    keyWallet: string;   // 主wallet, 注册账号时首次使用, 为EVM账号
    twitter: string;  // twitter账号
    discord: string;  // discord账号
    evmWallets: string[]; // 其它的EVM钱包
    aptWallets: string[]; // aptos 钱包账号

    isTwitterVerified: boolean; // twitter获得过验证
    isDiscordVerified: boolean; // discord获得过验证

    invitedCode: string; // 生成的邀请码, 可供其它人使用
    totalPoints:  number; // 获得的总points
}

export function DbArray2UserArray(rows: any[][]): User[] {
    let arr: User[] = [];
    for (let it of rows) {
        arr.push({
            keyWallet: it[1],
            twitter: it[2],
            discord: it[3],
            evmWallets: it[4].split(","),
            aptWallets: it[5].split(","),
            isTwitterVerified: it[6],
            isDiscordVerified: it[7],
            invitedCode: it[8],
            totalPoints: it[9]
        });
    }

    return arr;
}

