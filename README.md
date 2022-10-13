# Backend of GoMover Raffle System

## 使用说明

### API列表
|用途|URL|方法|参数|
| --- | --- | --- | --- |
| 绑定twitter | /twitter/verify | POST | WalletVerifyParams |
| 查询用户 | /wallet/query/{wallet} | GET | UserProfile |

### 参数说明
#### WalletVerifyParams
```json
WalletVerifyParams {
    raw: string;           # 随机字符串
    inviteCode: string;    # 邀请码, 如无, 置为空string
    wallet: string;        # 钱包地址
    type: WalletType;      # 钱包类型, 'evm' 或 aptos'
    signature: string;     # 签名信息
}
```
其中被签名的信息格式如下:
```js
function toString(): string {
    let v = this.verifyParam;
    return `${v.raw}-${v.inviteCode}-${v.type}`;
}
```

#### UserProfile
```json
UserProfile {
    wallet: string;   // wallet地址
    type: WalletType; // wallet类型, 'evm' 或 'aptos'
    twitter: string;  // twitter账号
    discord: string;  // discord账号

    inviteCode: string; // 生成的邀请码, 可供其它人使用
    invitedUser: number; // 已经邀请了多少人

    totalPoints:  number; // 获得的总points
}
```