import { User } from "./User";

// get the client
const mysql = require('mysql2/promise');

import dotenv from "dotenv";

dotenv.config();

const host = process.env.MYSQL_HOST || "127.0.0.1"
const user = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "123456";
const database = process.env.MYSQL_DB || "unimal_raffle";

export class MysqlWrapper {
    conn: any;

    async connect(): Promise<void> {
        /*
            this.conn = await mysql.createConnection({
                host,
                user,
                password,
                database,
                rowsAsArray: true
            });
           */

        this.conn = await mysql.createConnection({
            host: 'localhost',
            user: 'raffle',
            password: 'mkcweNUIAEfini374823hdkasfUIY*Y',
            database: "raffle",
            rowsAsArray: true,
        });
        console.log('createConnection successfully');

        await this.conn.connect();
        console.log('connect successfully')
    }

    async disconnect() {
        await this.conn.end();
    }

    async execute(sql: string, params: any[]) {
        await this.connect();
        let result = await this.conn.execute(sql, params);
        await this.disconnect();
        return result;
    }

    async insertUser(user: User, initPoint: number = 0) {
        let addSql = 'INSERT INTO users(Id, key_wallet, twitter, discord, evm_wallets, apt_wallets, twitter_verified, discord_verified, invite_code, total_points) VALUES(0,?,?,?,?,?,?,?,?,?)';
        let addSqlParams = [
            user.keyWallet,
            user.twitter,
            user.discord,
            user.evmWallets.join(","),
            user.aptWallets.join(","),
            0,
            0,
            "",
            initPoint
        ];

        return await this.execute(addSql, addSqlParams);
    }

    async updateUser(keyWallet: string, column: string, value: string | number | string[]) {
        let modSql = `UPDATE users SET ${column} = ? WHERE key_wallet = ?`;
        let modSqlParams = [value, keyWallet];

        return await this.execute(modSql, modSqlParams);
    }

    async addPoints(keyWallet: string, point: number) {
        let modSql = `UPDATE users SET total_points = total_points + ${point} WHERE key_wallet = ?`;
        let modSqlParams = [keyWallet];

        return await this.execute(modSql, modSqlParams);
    }

    async twitterVerified(keyWallet: string, point: number) {
        let modSql = `UPDATE users SET twitter_verified = 1, total_points = total_points + ${point} WHERE key_wallet = ?`;
        let modSqlParams = [keyWallet];

        return await this.execute(modSql, modSqlParams);
    }

    async discordVerified(keyWallet: string, point: number) {
        let modSql = `UPDATE users SET discord_verified = 1, total_points = total_points + ${point} WHERE key_wallet = ?`;
        let modSqlParams = [keyWallet];

        return await this.execute(modSql, modSqlParams);
    }

    async select(sql: string, params: any[]) {
        return await this.execute(sql, params);
    }
}
