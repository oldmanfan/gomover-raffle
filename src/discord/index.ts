import { Router } from "express";
import dotenv from "dotenv";
import { ApiResults } from "../utils";
import { VerifyWalletSinagure, WalletVerifyParams } from "../wallets";
import path from "path";
import fetch, { Headers } from "cross-fetch";
import { UserProfile } from "../module/UserProfile";
import { RewardPoints } from "../rules";
import { ReferralCode } from "../twitter/user";
import { RaffleDb } from "../module";

dotenv.config({ path: path.join(__dirname, "../.env") });

let discordRouter = Router();


const url = 'https://discord.com/api/oauth2/authorize?client_id=1033398142487498803&redirect_uri=https%3A%2F%2Fraffle.gomover.xyz%2Fdiscord%2Foauth%2Fcallback&response_type=code&scope=identify';
const client_id = process.env.DISCORD_CLIENT_ID || "1033398142487498803";
const client_secret = process.env.DISCORD_CLIENT_SECRET || "";
const callback = process.env.DISCORD_CLIENT_CALLBACK || "http://localhost:3000/discord/oauth/callback";

console.log(`discord setting: ${client_id} ${client_secret} ${callback}`);

async function getAccessToken(code: string) {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
        client_id,
        client_secret,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': callback
    });
    var config = {
        method: 'post',
        url: 'https://discord.com/api/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
    };

    let res = await axios(config);

    console.log(`access token: ${JSON.stringify(res.data)}`);
    return res.data;
}

async function getMe(tokenType: string, accessToken: string) {
    var axios = require('axios');
    var config = {
        method: 'get',
        url: 'https://discord.com/api/users/@me',
        headers: {
            'authorization': `${tokenType} ${accessToken}`,
        }
    };

    let res = await axios(config);
    console.log(`getMe: ${JSON.stringify(res.data)}`);
    return res.data;
}

discordRouter.post('/verify', async function (req, res) {
    try {
        if (!VerifyWalletSinagure(JSON.stringify(req.body))) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        const state = encodeURIComponent(JSON.stringify(req.body));
        const authUrl = `${url}&state=${state}`;
        //    res.redirect(authUrl);
        res.send(ApiResults.OK(authUrl));
    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

discordRouter.get("/oauth/callback", async function (req, res) {
    try {
        // console.log(`query: ${JSON.stringify(req.query)}`)
        const { code, state } = req.query;
        // 1. to verify the sign message is correct
        let verifyParamsStr = decodeURIComponent(state as string);
        if (!VerifyWalletSinagure(verifyParamsStr)) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        // 2. get user information by api
        let token = await getAccessToken(code as string);
        let me = await getMe(token.token_type, token.access_token);

        // 3. generate user info module
        let rawMessage = JSON.parse(verifyParamsStr) as WalletVerifyParams;
        let referralCode = ReferralCode(rawMessage.wallet);

        let profile: UserProfile = {
            wallet: rawMessage.wallet,
            type: rawMessage.type,
            twitter: "",
            discord: me.username,

            inviteCode: referralCode, // 生成的邀请码, 可供其它人使用
            invitedUser: 0, // 已经邀请了多少人

            totalPoints:  RewardPoints.BUNDLE_JOIN_DISCORD // 获得的总points
        };

        // 4. insert or update existing value.
        let db = new RaffleDb();
        let users = await db.selectUser(profile.wallet);
        if (users.length === 0) {
            await db.insertUser(profile);
        } else {
            profile.twitter = users[0].twitter;
            profile.totalPoints += users[0].totalPoints;
            await db.updateUser(profile);
        }

        // 发送邀请奖励
        if (users[0].inviteCode.length == 0 && rawMessage.inviteCode.length != 0) {
            await db.inviteSuccess(rawMessage.inviteCode, RewardPoints.INVITAT_USER);
        }

        res.send(ApiResults.OK());

        res.send(ApiResults.OK(JSON.stringify(me)));
    } catch (error) {
        res.send(ApiResults.UNKNOWN_ERROR(`${error}`));
    }
});

export {
    discordRouter
}
