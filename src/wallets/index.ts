// import { Router } from "express";
// import { RaffleDb } from "../module";
// import { ApiResults } from "../utils";

import { EvmWalletType, WalletVerifyParams } from "./common";
import { EvmVerifier } from "./evm-wallet";

// import { BindForm, BindFormUtils, } from "./bind-form";

// let walletRouter = Router();

// walletRouter.use((req, res, next) => {
//     next();
// });

// walletRouter.post('/bind', async function (req, res) {
//     try {
//         const form = req.body as BindForm;
//         const utils = new BindFormUtils(form);
//         let success = utils.verifySignature();
//         if (!success) {
//             res.send(ApiResults.SIGNATURE_ERROR());
//             return;
//         }

//         let db = new RaffleDb();
//         success = await db.insertUser(form);
//         if (!success) {
//             res.send(ApiResults.DB_ERROR());
//             return;
//         }

//         res.send(ApiResults.OK());
//     } catch (e) {
//         res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
//     }
// });

// walletRouter.get('/query/:wallet', async function(req, res) {
//     try {
//         const wallet = req.params.wallet;
//         let db = new RaffleDb();
//         let users = await db.selectUser(wallet);
//         if (users.length == 0) {
//             res.send(ApiResults.WALLET_NOT_BIND());
//         } else {
//             res.send(ApiResults.OK(JSON.stringify(users[0])));
//         }
//     } catch (e) {
//         res.send(ApiResults.UNKNOWN_ERROR(`${e}`));
//     }
// });

// export {
//     walletRouter as wrouter
// }

export function VerifyWalletSinagure(p: string): boolean {
    const verifyParam = JSON.parse(p) as WalletVerifyParams;

        if (verifyParam.type === EvmWalletType) {
            const verifier = EvmVerifier.fromObj(verifyParam);
            return verifier.verifySignature();
        }

        return false;
}

export * from "./evm-wallet";
export * from "./common";