import { MysqlWrapper } from "./MysqlWrapper";
import { DbArray2UserArray, UserProfile } from "./UserProfile";


export class RaffleDb {
    async updateUser(p: UserProfile): Promise<boolean> {
        let db = new MysqlWrapper();
        let sql = `UPDATE users set twitter = ${p.twitter}, discord = ${p.discord}, invite_code = ${p.inviteCode}, total_points = ${p.totalPoints} WHERE wallet = ?`;
        let r = await db.execute(sql, [p.wallet]);
        return r;
    }

    async insertUser(p: UserProfile): Promise<boolean> {
        let db = new MysqlWrapper();

        await db.connect();
        let u = (await db.execute('select count(wallet) as walletCount from users where wallet = ?', [p.wallet]));
        // console.log(`u: ${JSON.stringify(u)}`);

        let isExisted = u[0][0] != 0;
        if (isExisted) {
            await db.disconnect();
            return false;
        }

        let r = await db.insertUser(p);
        await db.disconnect();
        return r;
    }

    async addPoints(keyWallet: string, point: number) {
        let db = new MysqlWrapper();
        await db.connect();
        await db.addPoints(keyWallet, point);
        await db.disconnect();
    }

    async inviteSuccess(inviteCode: string, point: number) {
        let db = new MysqlWrapper();
        await db.connect();
        await db.execute(
            `UPDATE users SET invited_user = invited_user + 1, total_points = total_points + ${point} WHERE invite_code = ?`,
            [inviteCode]
        );
        await db.disconnect();
    }

    async selectUser(keyWallet: string): Promise<UserProfile[]> {
        let db = new MysqlWrapper();
        await db.connect();

        let sql = 'SELECT * from users where wallet = ?';
        let params = [keyWallet];
        let rows = await db.select(sql, params) as any[];

        await db.disconnect();

        return DbArray2UserArray(rows[0]);
    }
}