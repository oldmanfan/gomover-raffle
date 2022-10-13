import { Router } from "express";
import Client, { auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { RaffleDb } from "../module";
import { ApiResults } from "../utils";
import { RewardPoints } from "../rules";
import { VerifyWalletSinagure } from "../wallets";

dotenv.config();

let twitterRouter = Router();

const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID || "",
    client_secret: process.env.TWITTER_CLIENT_SECRET || "",
    callback: process.env.TWITTER_OAUTH_CALLBACK || "",
    scopes: ["tweet.read", "users.read"],
});

const client = new Client(authClient);

twitterRouter.use((req, res, next) => {
    // do something here for twitter api
    next();
});

twitterRouter.post('/verify', async function (req, res) {
    try {

        if (!VerifyWalletSinagure(req.body)) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        const authUrl = authClient.generateAuthURL({
            state: JSON.stringify(req.body),
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

        if (!VerifyWalletSinagure(state as string)) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        await authClient.requestAccessToken(code as string);

        let u = await client.users.findMyUser();
// TODO: to fetch user info from twitter
        console.log("findMyUser: ", JSON.stringify(u));
        // let db = new RaffleDb();
        // await db.twitterVerified(wallet);
        res.send(ApiResults.OK());
    } catch (error) {
        res.send(ApiResults.UNKNOWN_ERROR(`${error}`));
    }
});

export {
    twitterRouter as trouter
}
