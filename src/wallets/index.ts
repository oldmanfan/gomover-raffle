import { Router } from "express";
import { RaffleDb } from "../module";
import { ApiResults } from "../utils";

import { BindForm, BindFormUtils, } from "./bind-form";

let wrouter = Router();

wrouter.use((req, res, next) => {
    next();
});

wrouter.post('/bind', async function (req, res) {
    try {
        const form = req.body as BindForm;
        const utils = new BindFormUtils(form);
        let success = utils.verifySignature();
        if (!success) {
            res.send(ApiResults.SIGNATURE_ERROR());
            return;
        }

        let db = new RaffleDb();
        success = await db.insertUser(form);
        if (!success) {
            res.send(ApiResults.DB_ERROR());
            return;
        }

        res.send(ApiResults.OK());
    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

wrouter.get('/query/:wallet', async function(req, res) {
    try {
        const wallet = req.params.wallet;
        let db = new RaffleDb();
        let users = await db.selectUser(wallet);
        if (users.length == 0) {
            res.send(ApiResults.WALLET_NOT_BIND());
        } else {
            res.send(ApiResults.OK(JSON.stringify(users[0])));
        }
    } catch (e) {
        res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
    }
});

export {
    wrouter
}
