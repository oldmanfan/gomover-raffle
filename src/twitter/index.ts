import { Router } from "express";
import { auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { RaffleDb } from "../module";
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

trouter.get('/verify/:wallet', async function (req, res) {
	try {
    const wallet = req.params.wallet;

    let db = new RaffleDb();
    let users = await db.selectUser(wallet);
    if (users.length == 0) {
        res.send(ApiResults.WALLET_NOT_BIND());
        return;
    }

    const authUrl = authClient.generateAuthURL({
        state: wallet,
        code_challenge_method: "s256",
    });
    console.log('authUrl=', authUrl);
//    res.redirect(authUrl);
res.send(ApiResults.OK(authUrl));
	} catch(e) {
	 res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
}
});

trouter.get("/oauth/callback", async function (req, res) {
    try {
        const { code, state } = req.query;
        const wallet = state as string;

        let db = new RaffleDb();
        await db.twitterVerified(wallet);
        // TODO: (twitter完成认证之后, 跳转到哪个页面?)
//        res.redirect("/user/details");
	console.log(`twitter verify callback ${code}, ${state}`);
	res.send(ApiResults.OK());
        // if (state !== STATE) return res.status(500).send("State isn't matching");

        // const { token } = await authClient.requestAccessToken(code as string);
        // console.log('oauth callback token=', token);
        // res.redirect("/tweets");

    } catch (error) {
        console.log(error);
	 res.send(ApiResults.UNKNOWN_ERROR(`${error}`));
    }
});

trouter.get("/ifollowyou/:wallet", async function (req, res) {
    const wallet = req.params.wallet;
    let db = new RaffleDb();
    const usr = await db.selectUser(wallet)
    const isBind= (usr.length != 0);
    if (!isBind) {
        res.send(ApiResults.WALLET_NOT_BIND());
        return;
    }

    // TODO: check the friendship of user. Team of TwitterDev has not finished this API for v2 yet.

    // add points
    await db.addPoints(wallet, RewardPoints.BUNDLE_FOLLOW_TWITTER);

    res.send(ApiResults.OK());
})

export {
    trouter
}
