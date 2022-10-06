import { Router } from "express";
import { auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { addPoints, selectUser, twitterVerified } from "../module";
import { ApiResults } from "../utils";
import { RewardPoints } from "../rules";

dotenv.config();

let trouter = Router();

const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID || "",
    client_secret: process.env.TWITTER_CLIENT_SECRET || "",
    callback: process.env.TWITTER_OAUTH_CALLBACK || "",
    scopes: ["tweet.read", "users.read"],
});

// 使用STATE附加回调参数
const STATE = "my-state";

trouter.use((req, res, next) => {
    // do something here for twitter api
    next();
});

trouter.get('/oauth/:wallet', async function (req, res) {
    const wallet = req.params.wallet;

    // TODO: to check if this wallet address is bound
    // sql.findOne();


    const authUrl = authClient.generateAuthURL({
        state: wallet,
        code_challenge_method: "s256",
    });
    console.log('authUrl=', authUrl);
    res.redirect(authUrl);
});

trouter.get("/oauth/callback", async function (req, res) {
    try {
        const { code, state } = req.query;
        const wallet = state as string;

        await twitterVerified(wallet);
        // TODO: (twitter完成认证之后, 跳转到哪个页面?)
        res.redirect("/user/details");
        // if (state !== STATE) return res.status(500).send("State isn't matching");

        // const { token } = await authClient.requestAccessToken(code as string);
        // console.log('oauth callback token=', token);
        // res.redirect("/tweets");

    } catch (error) {
        console.log(error);
    }
});

trouter.get("/ifollowyou/:wallet", async function (req, res) {
    const wallet = req.params.wallet;
    const usr = await selectUser(wallet)
    const isBind= (usr != null);
    if (!isBind) {
        res.send(ApiResults.WALLET_NOT_BIND);
        return;
    }

    // TODO: check the friendship of user

    // add points
    await addPoints(wallet, RewardPoints.BUNDLE_FOLLOW_TWITTER);

    res.send(ApiResults.OK);
})

export {
    trouter
}