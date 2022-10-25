import { UserProfile } from "./UserProfile";

// get the client
const mysql = require('mysql2/promise');

import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(__dirname, "../.env")});


const host = process.env.MYSQL_HOST || "127.0.0.1"
const user = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "123456";
const database = process.env.MYSQL_DB || "unimal_raffle";

console.log(`mysql setting: ${host} ${user} ${password} ${database}`);

export class MysqlWrapper {
    conn: any;

    async connect(): Promise<void> {
            this.conn = await mysql.createConnection({
                host,
                user,
                password,
                database,
                rowsAsArray: true
            });

        await this.conn.connect();
    }

    async disconnect() {
        await this.conn.end();
    }

    async execute(sql: string, params: any[]) {
        // await this.connect();
        let result = await this.conn.execute(sql, params);
        // await this.disconnect();
        return result;
    }

    async insertUser(user: UserProfile) {
        let addSql = 'INSERT INTO users(Id, wallet, type, twitter, discord, invite_code, invited_user, total_points) VALUES(0,?,?,?,?,?,?,?)';
        let addSqlParams = [
            user.wallet,
            user.type,
            user.twitter,
            user.discord,
            user.inviteCode,
            user.invitedUser,
            user.totalPoints
        ];

        return await this.execute(addSql, addSqlParams);
    }

    async updateUser(keyWallet: string, column: string, value: string | number | string[]) {
        let modSql = `UPDATE users SET ${column} = ? WHERE wallet = ?`;
        let modSqlParams = [value, keyWallet];

        return await this.execute(modSql, modSqlParams);
    }

    async addPoints(keyWallet: string, point: number) {
        let modSql = `UPDATE users SET total_points = total_points + ${point} WHERE wallet = ?`;
        let modSqlParams = [keyWallet];

        return await this.execute(modSql, modSqlParams);
    }

    async select(sql: string, params: any[]) {
        return await this.execute(sql, params);
    }
}
