import { RewardPoints } from "../rules";
import { BindForm } from "../wallets/bind-form";
import { MysqlWrapper } from "./sql";
import { DbArray2UserArray, User } from "./User";


export class RaffleDb {
    async insertUser(form: BindForm): Promise<boolean> {
        let usr = BindFormToUser(form);
        let point = 0;
        if (form.aptWallets.length >= 1) {
            point += RewardPoints.CONNECT_APTOS_WALLET;

            if (form.evmWallets.length == 1) point += RewardPoints.CONNECT_EVM_WALLET_BY_APTOS_WALELT;
            else if (form.evmWallets.length >= 2) point += RewardPoints.CONNECT_2EVM_WALLET_BY_APTOS_WALLET;
        }

        let isExisted = (await this.selectUser(form.keyWallet)).length != 0;
        if (isExisted) return false;

        let db = new MysqlWrapper();
        return await db.insertUser(usr, point);
    }

    async addPoints(keyWallet: string, point: number) {
        let db = new MysqlWrapper();
        await db.addPoints(keyWallet, point);
    }

    async twitterVerified(keyWallet: string) {
        let db = new MysqlWrapper();
        await db.twitterVerified(keyWallet, RewardPoints.VERIFY_TWITTER);
    }

    async selectUser(keyWallet: string): Promise<User[]> {
        let db = new MysqlWrapper();
        let sql = 'SELECT * from users where key_wallet = ?';
        let params = [keyWallet];
        let rows = await db.select(sql, params) as any[];
        return DbArray2UserArray(rows[0]);
    }
}

function BindFormToUser(form: BindForm): User {
    return {
        keyWallet: form.keyWallet,
        twitter: form.twitter,
        discord: form.discord,
        evmWallets: form.evmWallets,
        aptWallets: form.aptWallets,

        isTwitterVerified: false,
        isDiscordVerified: false,

        invitedCode: "",
        totalPoints: 0
    } as User;
}