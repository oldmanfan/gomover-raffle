import { RewardPoints } from "../rules";
import { MysqlWrapper } from "./MysqlWrapper";
import { DbArray2UserArray, UserProfile } from "./UserProfile";


export class RaffleDb {
    async insertUser(p: UserProfile): Promise<boolean> {

        let isExisted = (await this.selectUser(p.wallet)).length != 0;
        if (isExisted) return false;

        let db = new MysqlWrapper();
        let point = RewardPoints.VERIFY_TWITTER;
        if (p.inviteCode.length > 0) {
            // db.
        }
        let r = await db.insertUser(p, point);
        await db.disconnect();
        return r;
    }

    async addPoints(keyWallet: string, point: number) {
        let db = new MysqlWrapper();
        await db.addPoints(keyWallet, point);
    }

    async selectUser(keyWallet: string): Promise<UserProfile[]> {
        let db = new MysqlWrapper();
        let sql = 'SELECT * from users where wallet = ?';
        let params = [keyWallet];
        let rows = await db.select(sql, params) as any[];
        return DbArray2UserArray(rows[0]);
    }
}