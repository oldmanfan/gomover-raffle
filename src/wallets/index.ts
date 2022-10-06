import { Router } from "express";
import { RaffleDb } from "../module";
import { ApiResults } from "../utils";

import {BindForm, BindFormUtils, } from "./bind-form";

let wrouter = Router();

wrouter.use((req, res, next) => {
    next();
});

wrouter.post('/bind', async function (req, res) {
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
});

export {
    wrouter
}