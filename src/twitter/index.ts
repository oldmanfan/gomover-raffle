import { Router } from "express";
import Client, { auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { RaffleDb } from "../module";
import { ApiResults } from "../utils";
import { VerifyWalletSinagure, WalletVerifyParams } from "../wallets";
import { CalculateUserPoints, ReferralCode, TwitterUser } from "./user";
import { UserProfile } from "../module/UserProfile";
import { RewardPoints } from "../rules";
import path from "path";

dotenv.config({path: path.join(__dirname, "../.env")});

let twitterRouter = Router();

const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID || "",
    client_secret: process.env.TWITTER_CLIENT_SECRET || "",
    callback: process.env.TWITTER_OAUTH_CALLBACK || "",
    scopes: ["tweet.read", "users.read"],
});

console.log(`twitter setting: ${process.env.TWITTER_CLIENT_ID} ${process.env.TWITTER_CLIENT_SECRET} ${process.env.TWITTER_OAUTH_CALLBACK}`);

const client = new Client(authClient);

twitterRouter.use((req, res, next) => {
    // do something here for twitter api
    next();
});

twitterRouter.post('/verify', async function (req, res) {
    try {
        if (!VerifyWalletSinagure(JSON.stringify(req.body))) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        const authUrl = authClient.generateAuthURL({
            state: encodeURIComponent(JSON.stringify(req.body)),
            code_challenge_method: "s256",
        });
        console.log('authUrl=', authUrl);
        //    res.redirect(authUrl);
        res.send(ApiResults.OK(authUrl));
    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

twitterRouter.get("/oauth/callback", async function (req, res) {
    try {
        const { code, state } = req.query;

        let verifyParamsStr = decodeURIComponent(state as string);
        if (!VerifyWalletSinagure(verifyParamsStr)) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        await authClient.requestAccessToken(code as string);

        let response = await client.users.findMyUser({
            "user.fields": ["id", "name", "username", "public_metrics", "verified"]
        });
        let tuser = response["data"] as TwitterUser;
        let rawMessage = JSON.parse(verifyParamsStr) as WalletVerifyParams;
        // console.log("findMyUser: ", JSON.stringify(tuser));

        let totalPoints = CalculateUserPoints(tuser);
        let referralCode = ReferralCode(rawMessage.wallet);

        let profile: UserProfile = {
            wallet: rawMessage.wallet,
            type: rawMessage.type,
            twitter: tuser.username,
            discord: "",

            inviteCode: referralCode, // 生成的邀请码, 可供其它人使用
            invitedUser: 0, // 已经邀请了多少人

            totalPoints:  totalPoints // 获得的总points
        };

        let db = new RaffleDb();
        let users = await db.selectUser(profile.wallet);
        if (users.length === 0) {
            await db.insertUser(profile);
        } else {
            profile.discord = users[0].discord;
            profile.totalPoints += users[0].totalPoints;
            await db.updateUser(profile);
        }

        // 发送邀请奖励
        if (users[0].inviteCode.length == 0 && rawMessage.inviteCode.length != 0) {
            await db.inviteSuccess(rawMessage.inviteCode, RewardPoints.INVITAT_USER);
        }

        res.send(ApiResults.OK());
    } catch (error) {
        res.send(ApiResults.UNKNOWN_ERROR(`${error}`));
    }
});

export {
    twitterRouter as trouter
}
