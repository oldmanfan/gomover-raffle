import { Router } from "express";
import { RaffleDb } from "../module";
import { ApiResults } from "../utils";

let walletRouter = Router();

walletRouter.get('/query/:wallet', async function (req, res) {
    try {
        const wallet = req.params.wallet;

        let db = new RaffleDb();
        let users = await db.selectUser(wallet);

        res.send(ApiResults.OK(JSON.stringify(users)));
    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

export {
    walletRouter
}